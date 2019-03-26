/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting causes an instance of this class to be created and
 * added to the Viewport container.
 */
Ext.define('demoApp.view.main.Main', {
    extend: 'Ext.Panel',
    xtype: 'app-main',
    itemId: 'main',
    requires: [
        'Ext.Carousel',
        'Ext.layout.Fit'
    ],
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
            xtype: 'carousel',
            itemId: 'slideflow',
            hidden: true,
            style: 'width:100%;height:100%',
            listeners: [
                {
                    initialize: function () {
                        var me = this
                        var items = Constants.slideUrl.map(function (url) {
                            return {
                                xtype: 'container',
                                layout: 'center',
                                tpl: '<img style="width:100%;height:auto" src="{src}" />',
                                data: {
                                    src: url
                                },
                                listeners: [
                                    {
                                        tap: function () {
                                            me.next()
                                        },
                                        element: 'element'
                                    }
                                ]
                            }
                        })
                        var lastItem = items[items.length - 1]
                        lastItem.listeners = [
                            {
                                tap: function () {
                                    me.fireEvent('tap')
                                },
                                element: 'element'
                            }
                        ]
                        this.add(items)
                    },
                }
            ]
        },
        {
            xtype: 'container',
            layout: 'center',
            itemId: 'image',
            tpl: '<img style="width:100%;height:auto" src="{src}" />',
            data: {
                src: Constants.imageUrl
            },
            listeners: [
                {
                    tap: function () {
                        this.component.fireEvent('tap', this.component)
                    },
                    element: 'element'
                }
            ]
        },
        {
            xtype: 'container',
            itemId: 'banner',
            hidden: true,
            data: {
                src: Constants.bannerUrl
            },
            tpl: '<img style="width:100%;height:auto" src="{src}" />'
        },
        {
            xtype: 'container',
            itemId: 'videoplayer',
            hidden: true,
            data: {
                src: Constants.videoUrl
            },
            tpl: `
                <video id="video" controls preload="auto" width="100%" height="auto">
                <source src="{src}" type="video/mp4">
                Your browser does not support the video tag.
                </video>
            `,
            listeners: [
                {
                    painted: function () {
                        var me = this.component
                        this.query('video', true, true).addEventListener('ended', function () {
                            me.fireEvent('videofinished')
                        }, false);
                    },
                    element: 'element',
                }
            ]
        }
    ],
    openUrlInApp: function (url) {
        var options = []

        options.push('location=no')
        options.push('clearcache=yes')
        options.push('clearsessioncache=yes')

        cordova.InAppBrowser.open(url, '_blank', options.join(','));
    },
    initialize: function () {
        var banner = this.queryById('banner')
        var videoPlayer = this.queryById('videoplayer')
        var image = this.queryById('image')
        var me = this

        var flow = function () {
            return Promise.resolve()
                .then(function () {
                    return new Promise(function (resolve, reject) {
                        me.scan(function (success, text) {
                            if (success) {
                                resolve(text)
                            } else {
                                reject()
                            }
                        })
                    })
                }).then(function () {
                    return new Promise(function (resolve, reject) {
                        image.setHidden(true)
                        videoPlayer.setHidden(false)
                        var elem = videoPlayer.element.getById('video').dom
                        elem.play()
                        if (elem.requestFullscreen) {
                            elem.requestFullscreen();
                        } else if (elem.mozRequestFullScreen) {
                            elem.mozRequestFullScreen();
                        } else if (elem.webkitRequestFullscreen) {
                            elem.webkitRequestFullscreen();
                        } else if (elem.msRequestFullscreen) {
                            elem.msRequestFullscreen();
                        }

                        videoPlayer.on('videofinished', function () {
                            resolve()
                        }, null, {
                                single: true
                            })
                    })
                }).then(function () {
                    me.openUrlInApp(Constants.url)

                    image.setHidden(false)
                    videoPlayer.setHidden(true)
                })
        }

        image.on('tap', function () {
            flow()
        })
    },
    scan: function (callback) {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (result.format == 'QR_CODE') {
                    //  alert(// "We got a QR Code\n\n" +
                    //        "Result: " + result.text + "\n\n" +
                    //   //     "Format: " + result.format + "\n" +
                    //   //     "Cancelled: " + result.cancelled + "\n\n" +
                    //        "Launching Appoval Success !");

                    console.log('scan success');
                    callback(true, result.text);
                } else {
                    callback(false, null);
                }
            },
            function (error) {
                callback(false, null)
            }, {
                prompt: "Place a QRcode inside the scan area",
                orientation: "potrait",
                showFlipCameraButton: true
            }
        );
    }
});
