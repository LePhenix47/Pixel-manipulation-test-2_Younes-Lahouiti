(()=>{"use strict";(()=>{function t(t,e){return t.getContext("2d",e)}function e(t,e,i){t.clearRect(0,0,e,i)}const{log:i,error:s,table:n,time:o,timeEnd:a,timeStamp:r,timeLog:h,assert:c,clear:l,count:u,countReset:x,group:d,groupCollapsed:p,groupEnd:f,trace:g,profile:m,profileEnd:v,warn:w,debug:y,info:k,dir:C,dirxml:D}=console;function T(t,e){switch(e.toLowerCase().trim()){case"lowercase":return t.toLowerCase();case"uppercase":return t.toUpperCase();case"titlecase":{let e=t.split(" ");for(let t=0;t<e.length;t++){const i=e[t].substring(0,1).toUpperCase(),s=e[t].slice(1).toLowerCase();e[t]=i+s}return e=e.concat(),e.toString()}case"titlecase2":return t.substring(0,1).toUpperCase()+t.substring(1).toLowerCase();default:throw new Error("Formatting text error: unknown option passed in argument")}}function b(t,e){return t.split(e)}function Y(t){let e=b(t,"-");for(let t=1;t<e.length;t++)e[t]=T(e[t],"titlecase");const i=e.join();return s=",",n="",i.replaceAll(s,n);var s,n}class S{constructor(t,e,i,s,n,o,a,r=0){this.context=t,this.width=e,this.height=i,this.originX=s,this.originY=n,this.color=o,this.x=this.originX,this.y=this.originY,this.gap=r,this.size=a-this.gap,this.vectorX=0,this.vectorY=0,this.mouseParticleDistanceX=0,this.mouseParticleDistanceY=0,this.mouseTotalDistance=0,this.force=0,this.angle=0,this.friction=.6*Math.random()+.15,this.ease=.2*Math.random()+.05}update(t,e,i=2e4){const{x:s,y:n}=this.context.canvas.getBoundingClientRect();this.mouseParticleDistanceX=t-this.x-s,this.mouseParticleDistanceY=e-this.y-n,this.mouseTotalDistance=Math.pow(this.mouseParticleDistanceX,2)+Math.pow(this.mouseParticleDistanceY,2);this.mouseTotalDistance<i&&(this.angle=Math.atan2(this.mouseParticleDistanceY,this.mouseParticleDistanceX),this.force=-1*i/this.mouseTotalDistance,this.vectorX=Math.cos(this.angle)*this.force,this.vectorY=Math.sin(this.angle)*this.force),this.vectorX*=this.friction,this.vectorY*=this.friction,this.x+=this.vectorX+(this.originX-this.x)*this.ease,this.y+=this.vectorY+(this.originY-this.y)*this.ease}draw(){this.context.fillStyle=this.color,this.context.fillRect(this.x,this.y,this.size,this.size)}}class X{constructor(e,s,n,o,a,r="transparent",h,c){this.canvas=e,this.context=t(e),this.particlesArray=[],this.text=s;const l=0===this.text.length;i({hasNoLetters:l}),l||(this.textColor=n,this.fontSize=o,this.fontFamily=a,this.strokeColor=r,this.strokeWidth=h,this.pixelResolution=c,this.wrapText(),this.convertToPixels(this.pixelResolution))}drawTextToCanvas(){this.context.fillStyle=this.textColor,this.context.strokeStyle=this.strokeColor,this.context.font=`${this.fontSize}px ${this.fontFamily}`,this.textMetrics=this.context.measureText(this.text),this.textX=this.canvas.width/2-this.textMetrics.width/2,this.textY=this.canvas.height/2+this.fontSize/2,this.context.lineWidth=this.strokeWidth,this.context.fillText(this.text,this.textX,this.textY),this.context.strokeText(this.text,this.textX,this.textY),this.pixelsData=this.context.getImageData(0,0,this.canvas.width,this.canvas.height)}wrapText(t=this.canvas.width){const e=b(this.text," ");let i="";this.context.fillStyle=this.textColor,this.context.strokeStyle=this.strokeColor,this.context.font=`${this.fontSize}px ${this.fontFamily}`,this.textMetrics=this.context.measureText(this.text),this.textX=this.canvas.width/2-this.textMetrics.width/2,this.textY=this.canvas.height/2,this.context.lineWidth=this.strokeWidth;for(let s=0;s<e.length;s++){const n=i+e[s]+" ";this.context.measureText(n).width>t&&s>0?(this.textX=this.canvas.width/2,this.textY=this.canvas.height/2,this.context.fillText(i,this.textX,this.textY),this.context.strokeText(i,this.textX,this.textY),i=e[s]+" ",this.textY+=this.fontSize):i=n}this.context.fillText(i,this.textX,this.textY),this.context.strokeText(i,this.textX,this.textY),this.pixelsData=this.context.getImageData(0,0,this.canvas.width,this.canvas.height)}animatePixels(t,e,i=2e4){for(const s of this.particlesArray)s.update(t,e,i),s.draw()}convertToPixels(t=1){e(this.context,this.canvas.width,this.canvas.height);for(let e=0;e<this.pixelsData.height;e+=t)for(let i=0;i<this.pixelsData.width;i+=t){const s=4*i+4*e*this.pixelsData.width;if(this.pixelsData.data[s+3]<10)continue;const n=this.pixelsData.data[s+0],o=this.pixelsData.data[s+1],a=this.pixelsData.data[s+2],r=`rgb(${n}, ${o}, ${a})`,h=new S(this.context,this.canvas.width,this.canvas.height,i,e,r,t,0);this.particlesArray.push(h)}}reset(){this.particlesArray=[]}}function _(t,e){var i;if(!e)return document.querySelector(t);return(null===(i=null==e?void 0:e.tagName)||void 0===i?void 0:i.includes("-"))?e.shadowRoot.querySelector(t):e.querySelector(t)}function A(t,e){if(!e)return Array.from(document.querySelectorAll(t));return e.tagName.includes("-")?Array.from(e.shadowRoot.querySelectorAll(t)):Array.from(e.querySelectorAll(t))}function L(t,e){return t.closest(e)}function E(t,e,i=document.body){const s=e.toString();return i.style.setProperty(t,s)}const M=[{key:"text",value:""},{key:"family",value:"Consolas"},{key:"fill",value:"white"},{key:"size",value:32},{key:"strokeColor",value:"transparent"},{key:"strokeWidth",value:1},{key:"pixelResolution",value:1}],P=_("canvas"),z=t(P,{willReadFrequently:!0}),N=_(".index__container");const R=new Map,W=new Map,q=_(".index__select"),F=A(".index__input:not(input#mouse-radius, input#text)").concat(q),$=_("input#text"),I=_("input#mouse-radius"),U=_("input#pixel-resolution"),H=A(".index__input--color"),j=A(".index__input--checkbox");function B(t){G(t);const e=t.target.value;R.set("radius",e)}function G(t){const e=t.currentTarget;let i=Number(e.value);const s=(n=i,new Intl.NumberFormat(o,{maximumSignificantDigits:3}).format(n));var n,o;_("span",e.parentElement).textContent=s}function J(t){tt();const e=t.currentTarget,s=A("label",L(e,".index__color-input-container"));let n=Y(e.name),o=isNaN(Number(e.value))?e.value:Number(e.value);const a="checkbox"!==e.type;if(i({isNotCheckboxInput:a}),a)return W.set(n,o),et(),void Z();const r=s[1],h=_("span",r),c=!e.checked;i({isNotChecked:c}),o=c?"transparent":h.innerText;const l=(u=r,Array.from(u.children))[1];var u;n=Y(l.name),i({colorInput:l}),W.set(n,o),et(),Z()}function K(t){const e=t.currentTarget,i=A("label",L(e,".index__color-input-container")),s=i[1],n=b(s.innerText,":")[0];let o=T(e.value,"uppercase");switch(_(".index__label-span",s).textContent=o,E("--bg-input-color",o,e),n){case"Canvas background":!_("input",i[0]).checked&&(o="transparent"),E("--bg-input-color",o,e),E("--bg-canvas",o,P);break;default:E("--bg-input-color",o,e)}}!function(){$.addEventListener("input",J),I.addEventListener("input",B),U.addEventListener("input",G);for(const t of F)t.addEventListener("change",J);for(const t of j)t.addEventListener("change",J);for(const t of H)t.addEventListener("input",K)}(),function(){for(const t of M){const{key:e,value:i}=t;W.set(e,i)}}();let O,Q=0;function V(){P.width=N.clientWidth,P.height=N.clientHeight,et()}function Z(){e(z,P.width,P.height),O.animatePixels(R.get("x"),R.get("y"),R.get("radius")),Q=requestAnimationFrame(Z)}function tt(){cancelAnimationFrame(Q),e(z,P.width,P.height),O.reset()}function et(){i(W),O=O=new X(P,W.get("text"),W.get("fill"),W.get("size"),W.get("family"),W.get("strokeColor"),W.get("strokeWidth"),W.get("pixelResolution"))}P.width=N.clientWidth,P.height=N.clientHeight,V(),window.addEventListener("resize",V),P.addEventListener("mousemove",(function(t){R.set("x",t.x),R.set("y",t.y)})),et(),Z()})()})();