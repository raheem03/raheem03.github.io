var u={},c,s,n=$("#container-publications");if(n.length){n.isotope({itemSelector:".isotope-item",percentPosition:!0,masonry:{columnWidth:".grid-sizer"},filter:function(){let t=$(this),e=c?t.text().match(c):!0,o=s?t.is(s):!0;return e&&o}});let i=$(".filter-search").keyup(d(function(){c=new RegExp(i.val(),"gi"),n.isotope()}));$(".pub-filters").on("change",function(){let e=$(this)[0].getAttribute("data-filter-group");if(u[e]=this.value,s=f(u),n.isotope(),e==="pubtype"){let o=$(this).val();o.substr(0,9)===".pubtype-"?window.location.hash=o.substr(9):window.location.hash=""}})}function d(i,t){let e;return t=t||100,function(){clearTimeout(e);let r=arguments,l=this;function a(){i.apply(l,r)}e=setTimeout(a,t)}}function f(i){let t="";for(let e in i)t+=i[e];return t}function p(){if(!n.length)return;let i=window.location.hash.replace("#",""),t="*";i!=""&&!isNaN(i)&&(t=".pubtype-"+i);let e="pubtype";u[e]=t,s=f(u),n.isotope(),$(".pubtype-select").val(t)}document.addEventListener("DOMContentLoaded",function(){$(".pub-filters-select")&&p(),$(".js-cite-modal").click(function(i){i.preventDefault();let t=$(this).attr("data-filename"),e=$("#modal");e.find(".modal-body code").load(t,function(o,r,l){if(r=="error"){let a="Error: ";$("#modal-error").html(a+l.status+" "+l.statusText)}else $(".js-download-cite").attr("href",t)}),e.modal("show")}),$(".js-copy-cite").click(function(i){i.preventDefault();let t=document.querySelector("#modal .modal-body code").innerHTML;navigator.clipboard.writeText(t).then(function(){console.debug("Citation copied!")}).catch(function(){console.error("Citation copy failed!")})}),$(".js-abstract-modal").click(function(i){i.preventDefault();let t=$(this).attr("data-filename"),e=$("#test");e.find(".test-body code").load(t,function(o,r,l){if(r=="error"){let a="Error: ";$("#test-error").html(a+l.status+" "+l.statusText)}else $(".js-download-abstract").attr("href",t)}),e.test("show")})});
