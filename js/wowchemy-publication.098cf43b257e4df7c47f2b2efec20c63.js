var u={},c,s,n=$("#container-publications");if(n.length){n.isotope({itemSelector:".isotope-item",percentPosition:!0,masonry:{columnWidth:".grid-sizer"},filter:function(){let t=$(this),e=c?t.text().match(c):!0,o=s?t.is(s):!0;return e&&o}});let i=$(".filter-search").keyup(f(function(){c=new RegExp(i.val(),"gi"),n.isotope()}));$(".pub-filters").on("change",function(){let e=$(this)[0].getAttribute("data-filter-group");if(u[e]=this.value,s=d(u),n.isotope(),e==="pubtype"){let o=$(this).val();o.substr(0,9)===".pubtype-"?window.location.hash=o.substr(9):window.location.hash=""}})}function f(i,t){let e;return t=t||100,function(){clearTimeout(e);let a=arguments,l=this;function r(){i.apply(l,a)}e=setTimeout(r,t)}}function d(i){let t="";for(let e in i)t+=i[e];return t}function p(){if(!n.length)return;let i=window.location.hash.replace("#",""),t="*";i!=""&&!isNaN(i)&&(t=".pubtype-"+i);let e="pubtype";u[e]=t,s=d(u),n.isotope(),$(".pubtype-select").val(t)}document.addEventListener("DOMContentLoaded",function(){$(".pub-filters-select")&&p(),$(".js-cite-modal").click(function(i){i.preventDefault();let t=$(this).attr("data-filename"),e=$("#modal");e.find(".modal-body code").load(t,function(o,a,l){if(a=="error"){let r="Error: ";$("#modal-error").html(r+l.status+" "+l.statusText)}else $(".js-download-cite").attr("href",t)}),e.modal("show")}),$(".js-copy-cite").click(function(i){i.preventDefault();let t=document.querySelector("#modal .modal-body code").innerHTML;navigator.clipboard.writeText(t).then(function(){console.debug("Citation copied!")}).catch(function(){console.error("Citation copy failed!")})}),$(".js-abstract-modal").click(function(i){i.preventDefault();let t=$(this).attr("data-filename"),e=$("#amodal");e.find(".modal-body code").load(t,function(o,a,l){if(a=="error"){let r="Error: ";$("#modal-error").html(r+l.status+" "+l.statusText)}else $(".js-download-cite").attr("href",t)}),e.modal("show")})});
