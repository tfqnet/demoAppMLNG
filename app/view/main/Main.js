/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting causes an instance of this class to be created and
 * added to the Viewport container.
 */
Ext.define('demoApp.view.main.Main', {
    extend: 'Ext.Panel',
    xtype: 'app-main',

    // requires: [
    //     'Ext.MessageBox',
    //     'Ext.layout.Fit'
    // ],
    fullscreen: true,
    layout: {
        type: 'vbox',
        pack: 'center'
    },
    controller: 'main',
    

    items:[
        {
            xtype : 'toolbar',
            docked: 'top',
            title: 'My Toolbar'
        },
    ],
    
});
