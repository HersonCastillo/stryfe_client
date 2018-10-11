import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Includes } from '../../../utils/Includes';
declare var $: any;
declare var paperDashboard: any;
@Component({
    selector: 'app-cpanel',
    templateUrl: './cpanel.component.html',
    styleUrls: ['./cpanel.component.css']
})
export class CpanelAdminComponent implements OnInit {
    constructor(
        private router: Router
    ) { }
    closeSessionModal(): void{
        Includes.question("¡Espera un momento!", "¿Estás seguro de que deseas cerrar sesión?", () => {
            localStorage.removeItem('token');
            localStorage.removeItem('u_data');
            this.router.navigate(['/login']);
        });
    }
    ngOnInit() {
        $("title").text("Administración");
        setTimeout(() => {
            let renovalNotification = sessionStorage.getItem('renoval');
            if(renovalNotification){
                try{
                    let parsed = JSON.parse(renovalNotification);
                    if(parsed.userId == Includes.getEmail()){
                        Includes.alert(parsed.title, parsed.text, parsed.icon);
                        sessionStorage.removeItem('renoval');
                    }
                }catch(ex){
                    Includes.saveErrorLog(ex);
                }
            }
        }, 500);
        $(document).ready(function () {
            let $sidebar = $('.sidebar');
            let $sidebar_img_container = $sidebar.find('.sidebar-background');
            let $full_page = $('.full-page');
            let $sidebar_responsive = $('body > .navbar-collapse');
            let sidebar_mini_active = true;
            let window_width = $(window).width();
            let fixed_plugin_open = $('.sidebar .sidebar-wrapper .nav li.active a p').html();
            $('.fixed-plugin a').click(function (event) {
                if ($(this).hasClass('switch-trigger')) {
                    if (event.stopPropagation) {
                        event.stopPropagation();
                    } else if (window.event) {
                        window.event.cancelBubble = true;
                    }
                }
            });
            $('.fixed-plugin .active-color span').click(function () {
                let $full_page_background = $('.full-page-background');
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
                var new_color = $(this).data('color');
                if ($sidebar.length != 0) {
                    $sidebar.attr('data-active-color', new_color);
                }
                if ($full_page.length != 0) {
                    $full_page.attr('data-active-color', new_color);
                }
                if ($sidebar_responsive.length != 0) {
                    $sidebar_responsive.attr('data-active-color', new_color);
                }
            });
            $('.fixed-plugin .background-color span').click(function () {
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
                var new_color = $(this).data('color');
                if ($sidebar.length != 0) {
                    $sidebar.attr('data-color', new_color);
                }
                if ($full_page.length != 0) {
                    $full_page.attr('filter-color', new_color);
                }
                if ($sidebar_responsive.length != 0) {
                    $sidebar_responsive.attr('data-color', new_color);
                }
            });
            $('.fixed-plugin .img-holder').click(function () {
                let $full_page_background = $('.full-page-background');
                $(this).parent('li').siblings().removeClass('active');
                $(this).parent('li').addClass('active');
                var new_image = $(this).find("img").attr('src');
                if ($sidebar_img_container.length != 0 && $('.switch-sidebar-image input:checked').length != 0) {
                    $sidebar_img_container.fadeOut('fast', function () {
                        $sidebar_img_container.css('background-image', 'url("' + new_image + '")');
                        $sidebar_img_container.fadeIn('fast');
                    });
                }
                if ($full_page_background.length != 0 && $('.switch-sidebar-image input:checked').length != 0) {
                    var new_image_full_page = $('.fixed-plugin li.active .img-holder').find('img').data('src');
                    $full_page_background.fadeOut('fast', function () {
                        $full_page_background.css('background-image', 'url("' + new_image_full_page + '")');
                        $full_page_background.fadeIn('fast');
                    });
                }
                if ($('.switch-sidebar-image input:checked').length == 0) {
                    var new_image = $('.fixed-plugin li.active .img-holder').find("img").attr('src');
                    var new_image_full_page = $('.fixed-plugin li.active .img-holder').find('img').data('src');
                    $sidebar_img_container.css('background-image', 'url("' + new_image + '")');
                    $full_page_background.css('background-image', 'url("' + new_image_full_page + '")');
                }
                if ($sidebar_responsive.length != 0) {
                    $sidebar_responsive.css('background-image', 'url("' + new_image + '")');
                }
            });

            $('.switch-sidebar-image input').on("switchChange.bootstrapSwitch", function () {
                let $full_page_background = $('.full-page-background');
                let $input = $(this);
                if ($input.is(':checked')) {
                    if ($sidebar_img_container.length != 0) {
                        $sidebar_img_container.fadeIn('fast');
                        $sidebar.attr('data-image', '#');
                    }
                    if ($full_page_background.length != 0) {
                        $full_page_background.fadeIn('fast');
                        $full_page.attr('data-image', '#');
                    }
                    let background_image = true;
                } else {
                    if ($sidebar_img_container.length != 0) {
                        $sidebar.removeAttr('data-image');
                        $sidebar_img_container.fadeOut('fast');
                    }
                    if ($full_page_background.length != 0) {
                        $full_page.removeAttr('data-image', '#');
                        $full_page_background.fadeOut('fast');
                    }
                    let background_image = false;
                }
            });
            $('.switch-mini input').on("switchChange.bootstrapSwitch", function () {
                let $body = $('body');
                let $input = $(this);
                //let paperDashboard;
                if (paperDashboard.misc.sidebar_mini_active == true) {
                    $('body').removeClass('sidebar-mini');
                    paperDashboard.misc.sidebar_mini_active = false;
                    $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();
                } else {
                    $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar('destroy');
                    setTimeout(function () {
                        $('body').addClass('sidebar-mini');
                        paperDashboard.misc.sidebar_mini_active = true;
                    }, 300);
                }
                // we simulate the window Resize so the charts will get updated in realtime.
                var simulateWindowResize = setInterval(function () {
                    window.dispatchEvent(new Event('resize'));
                }, 180);
                // we stop the simulation of Window Resize after the animations are completed
                setTimeout(function () {
                    clearInterval(simulateWindowResize);
                }, 1000);
            });

        });
    }
}
