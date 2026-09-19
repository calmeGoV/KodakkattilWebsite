/**
 * Drives every `Reveal` on the site: one IntersectionObserver set up by an
 * inline script, in place of the Framer Motion dependency that previously
 * shipped on every page.
 *
 * It comes in two halves, and the split is the point.
 *
 * `RevealInit` goes at the TOP of <body> and does one thing: marks the
 * document as script-capable. The CSS only hides `.reveal` elements when that
 * marker is present, so **the failure mode is "visible"** — if the script
 * throws, is blocked, or never runs, the page reads normally instead of being
 * a column of invisible sections. Putting it before the content also means the
 * hidden state is applied before first paint, so there is no flash of content
 * appearing and then being hidden to animate back in.
 *
 * `RevealScript` goes at the END of <body> and wires up the observer. A
 * MutationObserver catches nodes added later, so App Router client-side
 * navigations get the same treatment without React being involved.
 */

const INIT = `document.documentElement.classList.add('js-reveal')`;

const OBSERVER = `
(function(){
  var SEL='.reveal', SHOWN='data-reveal-shown', root=document.documentElement;
  function showAll(){
    var all=document.querySelectorAll(SEL);
    for(var i=0;i<all.length;i++)all[i].setAttribute(SHOWN,'');
  }
  try{
    if(!('IntersectionObserver' in window)){root.classList.remove('js-reveal');return;}
    var io=new IntersectionObserver(function(entries){
      for(var i=0;i<entries.length;i++){
        var e=entries[i];
        if(e.isIntersecting){e.target.setAttribute(SHOWN,'');io.unobserve(e.target);}
      }
    },{rootMargin:'0px 0px -12% 0px'});
    function observe(node){
      if(node.nodeType!==1)return;
      if(node.matches&&node.matches(SEL)&&!node.hasAttribute(SHOWN))io.observe(node);
      if(!node.querySelectorAll)return;
      var found=node.querySelectorAll(SEL);
      for(var i=0;i<found.length;i++){
        if(!found[i].hasAttribute(SHOWN))io.observe(found[i]);
      }
    }
    observe(document.body);
    new MutationObserver(function(muts){
      for(var i=0;i<muts.length;i++){
        var added=muts[i].addedNodes;
        for(var j=0;j<added.length;j++)observe(added[j]);
      }
    }).observe(document.body,{childList:true,subtree:true});
  }catch(err){
    // Anything unexpected: drop the marker so the CSS stops hiding, and
    // reveal whatever is already on the page.
    root.classList.remove('js-reveal');
    showAll();
  }
})();
`;

export function RevealInit() {
  return <script dangerouslySetInnerHTML={{ __html: INIT }} />;
}

export function RevealScript() {
  return <script dangerouslySetInnerHTML={{ __html: OBSERVER }} />;
}
