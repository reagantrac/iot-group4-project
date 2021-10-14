var $button = document.querySelector('.button');
$button.addEventListener('click', function() {
  var duration = 0.3,
      delay = 0.08;
  TweenMax.to($button, duration, {scaleY: 1.6, ease: Expo.easeOut});
  TweenMax.to($button, duration, {scaleX: 1.2, scaleY: 1, ease: Back.easeOut, easeParams: [3], delay: delay});
  TweenMax.to($button, duration * 1.25, {scaleX: 1, scaleY: 1, ease: Back.easeOut, easeParams: [6], delay: delay * 3 });
});

(function(win, doc) {
    const $ = s => doc.querySelector(s)
    const addEvent = (n, e, h) => {
      n.addEventListener(e, h, false)
    }
  
    const changeFilters = () => {
      target.style['webkit' + 'Filter'] = 'brightness(' + filtersMap['brightness'] + ')'
    }
  
    const setFilters = (key, value) => {
      if (!filtersMap) {return}
      filtersMap[key] = value
      changeFilters()
    }
  
    let filtersMap = {
      hue: '0deg',
      brightness: 1
    }    
  
  })(window, document)

  function openForm() {
    document.getElementById("newroom").style.display="none";
  }
  
  function closeForm() {
    document.getElementById("newroom").style.display="none";
  }