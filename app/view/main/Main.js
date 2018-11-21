/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting causes an instance of this class to be created and
 * added to the Viewport container.
 */
Ext.define('demoApp.view.main.Main', {
    extend: 'Ext.Panel',
    xtype: 'app-main',
    itemId: 'main',
    // requires: [
    //     'Ext.MessageBox',
    //     'Ext.layout.Fit'
    // ],
    fullscreen: true,
    layout: {
        type: 'vbox',
        pack: 'center'
    },
    config: {
        cls: 'main',
    },
    controller: 'main',
    items: [
        {
            xtype: 'container',
            itemId: 'banner',
            hidden: true,
            html: '<img style="width:100%;height:auto" src="resources/images/banner_1.png" />'
        },
        {
            xtype: 'container',
            itemId: 'qrcode',
            html: 'QR Code ' + new Date(),
            style: 'width:100%;height:100%',
            listeners: [
                {
                    tap: function () {
                        var component = this.component.up('app-main')
                        component.scan()
                    },
                    element: 'element'
                }
            ]
        },
        {
            xtype: 'video',
            itemId: 'videoplayer',
            hidden: true,
            url: 'resources/videos/video_1.mp4',
            loop: true,
            controls: true,
            autoResume: true,
            autoPause: true,
            preload: true
        }
    ],
    listeners: [
        {
            painted: function () {
            }
        }
    ],
    initialize: function () {
        var banner = this.queryById('banner')
        var qrcode = this.queryById('qrcode')
        var videoPlayer = this.queryById('videoplayer')
        var flow = new Promise(function (resolve, reject) {
            qrcode.on('scan', function () {
                qrcode.setHidden(true)
                banner.setHidden(false)
                resolve()
            })
        }).then(function () {
            return new Promise(function (resolve, reject) {
                banner.on('painted', function () {
                    setTimeout(function () {
                        banner.setHidden(true)
                        videoPlayer.setHidden(false)
                        videoPlayer.media.dom.play()
                        videoPlayer.media.dom.webkitEnterFullscreen()
                        resolve()
                    }, 1000)
                })
            })
        }).then(function () {

        })
    },
    scan: function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (result.format == 'QR_CODE') {
                    //  alert(// "We got a QR Code\n\n" +
                    //        "Result: " + result.text + "\n\n" +
                    //   //     "Format: " + result.format + "\n" +
                    //   //     "Cancelled: " + result.cancelled + "\n\n" +
                    //        "Launching Appoval Success !");

                    console.log('scan success');
                    // callback(true, result.text);
                } else {
                    // callback(false, null);
                    // Ext.Msg.show({
                    //     title: "Scan Error",
                    //     message: "Please scan again.",
                    //     buttons: Ext.MessageBox.OK,
                    // });
                }
            },
            function (error) {
                Ext.Msg.show({
                    title: "Scan Error",
                    message: "Please scan again.",
                    buttons: Ext.MessageBox.OK,
                });
            }, {
                prompt: "Place a QRcode inside the scan area",
                orientation: "potrait",
                showFlipCameraButton: true
            }
        );
    }
});
