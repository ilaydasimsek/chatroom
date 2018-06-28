//TODO cant remove cookies when the tabs are closed, add remove option
//TODO when a form is sent, dont refresh the whole page
$( function() {
            $( "#tabs" ).tabs({
      beforeLoad: function( event, ui ) {
        ui.jqXHR.fail(function() {
          ui.panel.html(
            "Couldn't load this tab. We'll try to fix this as soon as possible. ");
        });
      }
    });
} );

$(function() {
            var tabTitle = $( "#tab_title" ),
            tabContent = $("#tab_content");
            var tabTemplate = "<li> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>",
            tabCounter = 2;
            var tabs = $( '#tabs' ).tabs();

            // Modal dialog init: custom buttons and a "close" callback resetting the form inside
            var dialog = $( "#dialog" ).dialog({
            autoOpen: false,
            modal: true,
            async : true,
            buttons: {
                Add: function () {
                    addTab();
                     dialog.dialog('close');
                }
            },
            close: function() {
                form[ 0 ].reset();
            }
            });

            // AddTab form: calls addTab function on submit and closes the dialog
            var form = dialog.find( "form" ).on( "submit", function( event ) {
            addTab();
            dialog.dialog( "close" );
            event.preventDefault();
            });


            // Actual addTab function: adds new tab using the input from the form above
                function addTab() {
                    var label = tabTitle.val() || "Error",
                        id = "tabs-" + tabCounter,
                        li = $( tabTemplate.replace( /#\{label\}/g, label ) );

                    prevLabels = Cookies.get('labels');
                    if(typeof(prevLabels)!="undefined" && !prevLabels.includes(label) ){
                        Cookies.set('labels',prevLabels + ":" + label);
                    }
                    else if(typeof(prevLabels)=="undefined"){
                        Cookies.set('labels',label);

                    }
                        tabs.find( ".ui-tabs-nav" ).append( li );
                        tabs.tabs( "refresh" );
                        tabCounter++;
            }




            $( document ).ready(function() {
                addCookieTab();
                            // AddTab button: just opens the dialog

                });


             $( "#add_tab" ).button().on( "click",
                function() {
                    dialog.dialog( "open" );
                });

                // Close icon: removing the tab on click
                tabs.on( "click", "span.ui-icon-close", function() {
                    var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
                    $( "#" + panelId ).remove();
                    tabs.tabs( "refresh" );
                });

                tabs.on( "keyup", function( event ) {
                if ( event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE ) {
                    var panelId = tabs.find( ".ui-tabs-active" ).remove().attr( "aria-controls" );
                    $( "#" + panelId ).remove();
                    tabs.tabs( "refresh" );
                }
                });

                function addCookieTab() {
                    var labels = Cookies.get('labels'),
                        id = "tabs-" + tabCounter;
                    var varHref, labelList;
                    if (typeof(labels) != "undefined") {
                        labelList = labels.split(":");
                        console.log(labelList);
                        for (i = 0; i < labelList.length; i++) {
                            varHref = "/user/"+username+"/chat/"+labelList[i]+"/";
                            li = $( tabTemplate.replace( /#\{href\}/g, varHref ).replace( /#\{label\}/g, labelList[i] ) );

                            tabs.find( ".ui-tabs-nav" ).append( li );
                            tabs.tabs( "refresh" );
                            tabCounter++;
                            console.log(labelList[i]);
                        }
                    }

                }

        });

