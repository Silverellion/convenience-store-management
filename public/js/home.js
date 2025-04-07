$(document).ready(function () {
    // Animation Hover thanh nav
    $(".nav-link").hover(function () {
        $(this).animate({ left: 0 }, 200);
    }, function () {
        $(this).animate({ left: -10 }, 200);
    });

    // Chức năng chuyển nội dung
    $(".nav-link").click(function (e) {
        e.preventDefault();

        // Ẩn các phần đang active
        $(".nav-link").removeClass("active");

        // Thêm lớp active vào link
        $(this).addClass("active");

        // Gán nội dung hiển thị
        var contentId = $(this).data("content");

        // Chuyển nội dung tiêu đề 
        var pageTitle = $(this).data("title");
        $(".page-title").text(pageTitle);

        // Ẩn tất cả nội dungdung
        $(".content-section").hide();

        // Hiện nội dung được chọn
        $("#" + contentId + "-content").show();
    });

    function loadHTML(id, file) {
        fetch(file)
            .then(response => response.text())
            .then(data => {
                document.getElementById(id).innerHTML = data;
            });
    }

    loadHTML('dashboard-content', 'dashboard.html');
    loadHTML('products-content', 'products.html');
    loadHTML('orders-content', 'orders.html');
    loadHTML('accounts-content', 'accounts.html');
    loadHTML('onboard-content', 'onboard.html');
});