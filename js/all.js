// Navbar tooltip
// 類陣列轉陣列

// 第一種方式
// var dom = [].slice.call(document.querySelectorAll('#navbar a'))

// 第二種方式
// var dom = Array.from(document.querySelectorAll('#navbar a'))

// 第三種方式
// var dom = [...document.querySelectorAll('.navbar-nav .nav-link')]
// 回傳一個新陣列
// var tooltipList = dom.map(function (item) {
//   return new bootstrap.Tooltip(item, {
//     offset: [0, 0],
//     placement: 'top'
//   })
// })
// 點選後所有 tooltip 消失，上一個 tooltip 不會有暫留的問題
// $('.navbar-nav .nav-link').on('click', function (e) {
//   tooltipList.forEach(function (item) {
//     item.hide()
//   })
// })

// -------------------------------------------------------------------------------------------------------------------------

// Modal
// 測試中 ---> 開啟 modal 不會讓 navbar 背景出現抖動
// 這是因為開啟 modal 時，bootstrap 替 body 增加 overflow hidden，
// 並且替 body、navabr 增加 padding-right，造成整個畫面寬度變寬，
// 此時背景圖若有使用 background-position 水平設定 center，會讓背景變寬(因為整個畫面已經變寬)
$('#reg_btn, #login_btn').on('click', function () {
  $('body,#navbar').css({
    overflow: 'auto',
    'padding-right': 0
  })
})

// section03 生物種族
$('#race a').on('click', function () {
  $('#race a').removeClass('active')
  $(this).addClass('active')
})

// Swiper ----------------------------------------------------------------------------------------------------
const swiper = new Swiper('.swiper', {
  direction: 'horizontal',
  loop: true,
  speed: 1000,
  spaceBetween: 15, // 換圖時圖片與圖片間的距離
  centeredSlides: true, // 將 item 置中排列，開始時第一張會在正中間
  autoplay: {
    delay: 1000000, // 自動播放，設定幾秒播放下一張
  },
  slidesPerView: 'auto',
  effect: "coverflow",
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
  },

  breakpoints: {
    576: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
    },
    920: {
      slidesPerView: 3,
    },
    1200: {
      slidesPerView: 4,
    }
  },

  pagination: {
    el: '.swiper-pagination',
    dynamicBullets: false,
    clickable: true,
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  }
});

// GSAP ------------------------------------------------------------------------------------------------------
// 註冊 plugin
gsap.registerPlugin(ScrollToPlugin, ScrollTrigger, SplitText)

// ScrollToPlugin 滑動效果 ------------------------------------------------------------------------------------
// 須取消 scroll-behavior: smooth，可從 _variables.scss 關閉 $enable-smooth-scroll: false
$('#navbar .main-link,.backtop a').each(function (index, link) {
  $(this).on('click', function (e) {
    e.preventDefault() // 阻止 a 連結預設動作
    if ($(this).attr('href') == '#section04' || $(this).attr('href') == '#section05') {
      gsap.to($(window), {
        scrollTo: {
          y: `#section0${index + 1}`
        },
        duration: 1.5,
        ease: 'back.inOut'
      })
    } else {
      gsap.to($(window), {
        scrollTo: {
          y: `#section0${index + 1}`,
          offsetY: 150
        },
        duration: 1.5,
        ease: 'back.inOut'
      })
    }
  })
})

// 補間動畫 --------------------------------------------------------------------------------------------------
// 導覽列滾動收合
gsap.from('#navbar', {
  yPercent: -100,
  paused: false,
  duration: 0.5,
  // 沒有 trigger 觸發目標，整份文件是捲動監控
  scrollTrigger: {
    start: "top 60", // scroller-start 與 scroll-end 必須要有一個高度才能一開始觸發進入 onEnter 偵測的階段
    end: () => '+=' + document.documentElement.scrollHeight, // end 整份文件高度
    onEnter(self) {
      console.log(self) // 該捲動軸實體
      console.log(self.animation) // 捲動軸實體控制的動畫
      self.animation.play() // 使用該實體讓動畫播放
    },
    onUpdate: (self) => {
      console.log(self.direction) // 捲動軸方向，1 為往下，-1 為網下
      self.direction === -1 ? self.animation.play() : self.animation.reverse() // -1 往上時正向播放，否則 1 往下時反向播放
    },
    markers: false
  },
});

// 流星
// 創建流星數目
function createStar(starNumber) {
  for (let i = 0; i < starNumber; i++) {
    $('.shooting_star').append('<div class="star"></div>')
  }
  const stars = gsap.utils.toArray('.star')
  return stars
}

// 設定補間動畫預設值
function setTween(stars) {
  gsap.set('.shooting_star', {
    perspective: 800
  })
  stars.forEach(function (star, index) {
    gsap.set(star, {
      transformOrigin: '0% 50% 100px',
      position: 'absolute',
      left: gsap.utils.random($(window).width() / 2, $(window).width() * 2),
      top: gsap.utils.random(-100, -200),
      rotation: -25
    })
  })
  return stars
}

function playTimeline(stars) {
  const tl = gsap.timeline({
    repeat: -1
  })
  stars.forEach(function (star, index) {
    tl.to(
      star, {
        x: () => `-=${$(window).width() * 1.5}`,
        y: () => `+=${$(window).height() * 1.5}`,
        z: () => `random(50,500)`,
        duration: 1,
        delay: 'random(1,5)',
        ease: 'none'
      },
      '<' + gsap.utils.random(0, 5)
    )
  })
}
const playStar = gsap.utils.pipe(createStar, setTween, playTimeline)
playStar(30)

// ScrollTrigger 滾動軸 --------------------------------------------------------------------------------------
// backtop 回頂端顯示隱藏
gsap.to('.backtop', {
  scrollTrigger: {
    trigger: '#footer',
    start: 'top bottom', // top、center、bottom、px、%（相對於頂端）
    end: '100% bottom',
    toggleActions: 'play none none reverse'
    // markers: true,
  },
  display: 'block',
  opacity: 1,
  duration: 1
})

// 導覽列 active 位置
$('.main-link').each(function (index, link) {
  let href = $(link).attr('href')
  gsap.to(link, {
    scrollTrigger: {
      trigger: `${href}`,
      start: 'top center',
      end: 'bottom center',
      toggleClass: {
        targets: link,
        className: 'active'
      }
      // markers: true
    }
  })
})

// 視差效果 --------------------------------------------------------------------------------------------------
// 星空背景
gsap.to('body', {
  scrollTrigger: {
    trigger: 'body',
    start: 'top 0%',
    end: 'bottom 0%',
    scrub: 5
    // markers: true,
  },
  backgroundPosition: '50% 100%',
  ease: 'none'
  // transformOrigin: '50% 100%',
  // scale: 0,
})

// 浮空的島
const float_tl = gsap.timeline({
  scrollTrigger: {
    trigger: 'body',
    start: 'top 100%',
    end: 'bottom 100%',
    scrub: 5
    // markers: true
  },
  ease: 'none'
})

// 1. 使用 timeline 操作進場位置
float_tl
  .from('.float-wrap-01', {
    left: '-30%'
  })
  .from(
    '.float-wrap-02', {
      right: '-30%'
    },
    '<'
  )
  .from(
    '.float-wrap-03', {
      bottom: '-100%'
    },
    '<'
  )

// 2. 自身上下浮動使用 gsap.to()
$('.float-island').each(function (index, island) {
  gsap.to(island, {
    y: 50 * (index + 1),
    duration: 10 * (index + 1),
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  })
})

// 霧
$('.fog').each(function (index, fog) {
  // 設定 duration 為 0 的 fog 補間動畫
  gsap.set(fog, {
    width: '100%',
    height: '100%',
    background: `url(./images/fog.png) no-repeat center/80%`,
    opacity: 0.8,
    position: 'absolute',
    top: 'random(0,100)' + '%',
    x: function () {
      return index % 2 == 0 ? -$(window).width() : $(window).width()
    }
  })
  gsap.to(fog, {
    x: function () {
      return index % 2 == 0 ? $(window).width() : -$(window).width()
    },
    onRepeat() {
      $(fog).css({
        top: gsap.utils.random(0, 100) + '%'
      })
    },
    repeat: -1,
    duration: 60,
    ease: 'none'
  })
})

// SplitText ------------------------------------------------------------------------------------------------
gsap.set('#splitText', {
  perspective: 400
})
const tl = gsap.timeline({
  repeat: -1,
  repeatDelay: 8
})
const paragraphs = gsap.utils.toArray('#splitText p')
const splitText = paragraphs.map(function (p) {
  return new SplitText(p, {
    charsClass: 'charBg'
  })
})

// 文字進場、退場動畫
splitText.forEach(function (item) {
  const chars = item.chars
  tl.from(
    chars, {
      y: 80,
      rotationX: 0,
      rotationY: 180,
      scale: 2,
      transformOrigin: '0% 50% -100', // x,y,z 變形原點定位
      opacity: 0,
      duration: 2,
      ease: 'back',
      stagger: 0.1,
      onComplete() {
        gsap.to(chars, {
          delay: 3,
          duration: 2,
          opacity: 0,
          scale: 2,
          y: 80,
          rotationX: 180,
          rotationY: 0,
          transformOrigin: '0% 50% -100',
          ease: 'back',
          stagger: {
            each: 0.1
          }
        })
      }
    },
    '+=3'
  )
})