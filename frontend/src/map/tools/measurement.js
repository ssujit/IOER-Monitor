const measurement={
    selector:"#measure",
    getDOMContainer:function(){
        $elem = $(`${this.selector}`);
        return $elem;
    },
    set:false,
    surveyElement: L.control.measure({
        primaryLengthUnit: 'kilometers',
        secondaryLengthUnit: 'meters',
        captureZIndex: 10000,
        primaryAreaUnit: 'hectares',
        activeColor: farbschema.getColorActive(),
        completedColor: farbschema.getColorMain(),
        position: 'topleft',
        localization: 'de',
        collapsed: false
    }),
    init:function(){
        measurement.controller.set();
    },
    controller:{
        set:function(){
            $(document).on("click",measurement.selector,function () {
                if(!measurement.set){
                    measurement.show();
                }else{
                    measurement.remove();
                }
            });

            //leave the function with escape
            $(document).keyup(function(e) {
                if (e.keyCode === 27) {
                    measurement.remove();
                }
            });
        }
    },
    show:function(){
        alertLeafveFunction();
        $('.toolbar').toggleClass("toolbar_close",500);
        this.getDOMContainer().css('background-color',farbschema.getColorActive());
        this.surveyElement.addTo(map);
        $('.leaflet-control-measure-toggle ')
            .animate({"width":"80px","height":"80px"},1000,
                function(){
                    $(this).css({"width":"40px","height":"40px"})
                });
        this.set=true;
    },
    remove:function(){
        this.surveyElement.remove();
        this.getDOMContainer().css('background-color','#4E60AA;');
        this.set=false;
    }
};