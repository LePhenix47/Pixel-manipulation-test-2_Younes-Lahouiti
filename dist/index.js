(()=>{"use strict";(()=>{function t(t,e){return t.getContext("2d",e)}function e(t,e,i){t.clearRect(0,0,e,i)}class i{constructor(t,e,i,s,n,o,r,a=0){this.context=t,this.width=e,this.height=i,this.originX=s,this.originY=n,this.color=o,this.x=this.originX,this.y=this.originY,this.gap=a,this.size=r-this.gap,this.vectorX=0,this.vectorY=0,this.mouseParticleDistanceX=0,this.mouseParticleDistanceY=0,this.mouseTotalDistance=0,this.force=0,this.angle=0,this.friction=.6*Math.random()+.15,this.ease=.2*Math.random()+.05}update(t,e,i=2e4){const{x:s,y:n}=this.context.canvas.getBoundingClientRect();this.mouseParticleDistanceX=t-this.x-s,this.mouseParticleDistanceY=e-this.y-n,this.mouseTotalDistance=Math.pow(this.mouseParticleDistanceX,2)+Math.pow(this.mouseParticleDistanceY,2);this.mouseTotalDistance<i&&(this.angle=Math.atan2(this.mouseParticleDistanceY,this.mouseParticleDistanceX),this.force=-1*i/this.mouseTotalDistance,this.vectorX=Math.cos(this.angle)*this.force,this.vectorY=Math.sin(this.angle)*this.force),this.vectorX*=this.friction,this.vectorY*=this.friction,this.x+=this.vectorX+(this.originX-this.x)*this.ease,this.y+=this.vectorY+(this.originY-this.y)*this.ease}draw(){this.context.fillStyle=this.color,this.context.fillRect(this.x,this.y,this.size,this.size)}}class s{constructor(e,i,s,n,o,r="transparent",a,c){this.canvas=e,this.context=t(e),this.particlesArray=[],this.text=i,this.textColor=s,this.fontSize=n,this.fontFamily=o,this.strokeColor=r,this.strokeWidth=a,this.pixelResolution=c,this.createText(),this.convertToPixels(this.pixelResolution)}createText(){this.context.fillStyle=this.textColor,this.context.strokeStyle=this.strokeColor,this.context.font=`${this.fontSize}px ${this.fontFamily}`,this.textMetrics=this.context.measureText(this.text),this.textX=this.canvas.width/2-this.textMetrics.width/2,this.textY=this.canvas.height/2+this.fontSize/2,this.context.lineWidth=this.strokeWidth,this.context.fillText(this.text,this.textX,this.textY),this.context.strokeText(this.text,this.textX,this.textY),this.pixelsData=this.context.getImageData(0,0,this.canvas.width,this.canvas.height)}animatePixels(t,e,i=2e4){for(const s of this.particlesArray)s.update(t,e,i),s.draw()}convertToPixels(t=1){e(this.context,this.canvas.width,this.canvas.height);for(let e=0;e<this.pixelsData.height;e+=t)for(let s=0;s<this.pixelsData.width;s+=t){const n=4*s+4*e*this.pixelsData.width;if(this.pixelsData.data[n+3]<10)continue;const o=this.pixelsData.data[n+0],r=this.pixelsData.data[n+1],a=this.pixelsData.data[n+2],c=`rgb(${o}, ${r}, ${a})`,h=new i(this.context,this.canvas.width,this.canvas.height,s,e,c,t,0);this.particlesArray.push(h)}}reset(){this.particlesArray=[]}}const{log:n,error:o,table:r,time:a,timeEnd:c,timeStamp:h,timeLog:l,assert:u,clear:d,count:x,countReset:p,group:f,groupCollapsed:g,groupEnd:m,trace:v,profile:y,profileEnd:w,warn:k,debug:b,info:C,dir:D,dirxml:_}=console;function S(t,e){var i;if(!e)return document.querySelector(t);return(null===(i=null==e?void 0:e.tagName)||void 0===i?void 0:i.includes("-"))?e.shadowRoot.querySelector(t):e.querySelector(t)}function T(t,e){if(!e)return Array.from(document.querySelectorAll(t));return e.tagName.includes("-")?Array.from(e.shadowRoot.querySelectorAll(t)):Array.from(e.querySelectorAll(t))}function A(t,e){return t.closest(e)}function X(t,e,i=document.body){const s=e.toString();return i.style.setProperty(t,s)}function Y(t,e){switch(e.toLowerCase().trim()){case"lowercase":return t.toLowerCase();case"uppercase":return t.toUpperCase();case"titlecase":{let e=t.split(" ");for(let t=0;t<e.length;t++){const i=e[t].substring(0,1).toUpperCase(),s=e[t].slice(1).toLowerCase();e[t]=i+s}return e=e.concat(),e.toString()}case"titlecase2":return t.substring(0,1).toUpperCase()+t.substring(1).toLowerCase();default:throw new Error("Formatting text error: unknown option passed in argument")}}function P(t,e){return t.split(e)}function L(t){let e=P(t,"-");for(let t=1;t<e.length;t++)e[t]=Y(e[t],"titlecase");const i=e.join();return s=",",n="",i.replaceAll(s,n);var s,n}const E=[{key:"text",value:""},{key:"family",value:"Consolas"},{key:"fill",value:"white"},{key:"size",value:32},{key:"strokeColor",value:"transparent"},{key:"strokeWidth",value:1},{key:"pixelResolution",value:1}],M=S("canvas"),R=t(M,{willReadFrequently:!0}),z=S(".index__container");const q=new Map,N=new Map,W=S(".index__select"),F=T(".index__input:not(input#mouse-radius, input#text)").concat(W),$=S("input#text"),I=S("input#mouse-radius"),U=T(".index__input--color"),H=T(".index__input--checkbox");function j(t){}function B(t){V();const e=t.currentTarget,i=T("label",A(e,".index__color-input-container"));let s=L(e.name),o=isNaN(Number(e.value))?e.value:Number(e.value);const r="checkbox"!==e.type;if(n({isNotCheckboxInput:r}),r)return N.set(s,o),Z(),void Q();const a=i[1],c=S("span",a),h=!e.checked;n({isNotChecked:h}),o=h?"transparent":c.innerText;const l=(u=a,Array.from(u.children))[1];var u;s=L(l.name),n({colorInput:l}),N.set(s,o),Z(),Q()}function G(t){const e=t.currentTarget,i=T("label",A(e,".index__color-input-container")),s=i[1],n=P(s.innerText,":")[0];let o=Y(e.value,"uppercase");switch(S(".index__label-span",s).textContent=o,X("--bg-input-color",o,e),n){case"Canvas background":!S("input",i[0]).checked&&(o="transparent"),X("--bg-input-color",o,e),X("--bg-canvas",o,M);break;default:X("--bg-input-color",o,e)}}!function(){$.addEventListener("input",B),I.addEventListener("input",j);for(const t of F)t.addEventListener("change",B);for(const t of H)t.addEventListener("change",B);for(const t of U)t.addEventListener("input",G)}(),function(){for(const t of E){const{key:e,value:i}=t;N.set(e,i)}}();let J,K=0;function O(){M.width=z.clientWidth,M.height=z.clientHeight,Z()}function Q(){e(R,M.width,M.height),J.animatePixels(q.get("x"),q.get("y"),q.get("radius")),K=requestAnimationFrame(Q)}function V(){cancelAnimationFrame(K),e(R,M.width,M.height),J.reset()}function Z(){n(N),J=J=new s(M,N.get("text"),N.get("fill"),N.get("size"),N.get("family"),N.get("strokeColor"),N.get("strokeWidth"),N.get("pixelResolution"))}M.width=z.clientWidth,M.height=z.clientHeight,O(),window.addEventListener("resize",O),M.addEventListener("mousemove",(function(t){q.set("x",t.x),q.set("y",t.y)})),Z(),Q()})()})();