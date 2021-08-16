jQuery(function($) {
    $('.bg-slider').bgSwitcher({
        images: ['./images/slide_show/slide1.jpg', './images/slide_show/slide2.jpg', './images/slide_show/slide3.jpg', './images/slide_show/slide4.jpg'], // 切替背景画像を指定
	      interval: 10000, // 背景画像を切り替える間隔を指定 3000=3秒
        loop: true, // 切り替えを繰り返すか指定 true=繰り返す　false=繰り返さない
        shuffle: true, // 背景画像の順番をシャッフルするか指定 true=する　false=しない
        effect: "fade", // エフェクトの種類をfade,blind,clip,slide,drop,hideから指定
        duration: 1000, // エフェクトの時間を指定します。
        easing: "swing" // エフェクトのイージングをlinear,swingから指定
    });
});
