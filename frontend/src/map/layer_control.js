const layer_control={
    control:'',
    state:'sw',
    endpoint_id:"layer_control",
    text:{
      de:{
          title:"Karten",
          grund:"Grundkarten",
          extra:"Zusatzkarten",
          empty:"kein Hintergrund",
          laender:"Ländergrenzen",
          kreis:"Kreisgrenzen",
          gemeinde:"Gemeindegrenzen",
          autobahn:"Autobahnnetz (Stand 2015)",
          bahn:"Fernbahnnetz (Stand 2016)",
          wasser:"Gewässer"
      },
      en:{
          title:"Maps",
          grund:"Base Maps",
          extra:"Extra Maps",
          empty:"no Background",
          laender:"National borders",
          kreis:"District boundaries",
          gemeinde:"Municipal boundaries",
          autobahn:"Autobahn network (as of 2015)",
          bahn:"Long-distance railway network (as of 2016)",
          wasser:"Waters"
      }
    },
    baselayer:{
        paramter:'baselayer',
        baselayer_sw:{
            topplus:L.tileLayer.wms('https://sgx.geodatenzentrum.de/wms_topplus_web_open', {
                layers: 'web_grau',
                version: '1.3.0',
                format: 'image/png',
                srs:"EPSG:3035",
                transparent: true,
                name: "topplus",
                attribution: '<a href="https://www.bkg.bund.de">TopPlus © GeoBasis- DE / BKG ('+(new Date).getFullYear()+')</a>',
                id: 'baselayer'
            }),
            webatlas:L.tileLayer.wms('https://sg.geodatenzentrum.de/wms_webatlasde.light_grau?', {
                layers: 'webatlasde.light_grau',
                version: '1.3.0',
                format: 'image/png',
                srs:"EPSG:3035",
                transparent: true,
                name: "webatlas",
                attribution: '<a href="https://www.geodatenzentrum.de/geodaten/gdz_rahmen.gdz_div?gdz_spr=deu&gdz_akt_zeile=4&gdz_anz_zeile=4&gdz_unt_zeile=0&gdz_user_id=0">© GeoBasis- DE / BKG ('+(new Date).getFullYear()+')</a>',
                id: 'baselayer'
            }),
            noBackground: L.tileLayer('',{name:"noBackground",id: 'baselayer'}),
            satellite: L.tileLayer.grayscale('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '&copy; Esri',name: "satellite",id: 'baselayer'}),
            osm : L.tileLayer.grayscale('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',name: "osm",id: 'baselayer'})
        },
        baselayer_rgb:{
            flaechenschema:new L.tileLayer.wms("https://maps.ioer.de/cgi-bin/mapserv_dv?map=/mapsrv_daten/detailviewer/wms_mapfiles/flaechenschema.map", {
                layers: "Flaechenschema",
                version: '1.3.0',
                format: 'image/png',
                srs:"EPSG:3035",
                transparent: true,
                name: "flaechenschema",
                id: 'baselayer'
            }),
            webatlas:L.tileLayer.wms('https://sg.geodatenzentrum.de/wms_webatlasde.light?', {
                layers:'webatlasde.light',
                version: '1.3.0',
                format: 'image/png',
                srs:"EPSG:3035",
                transparent: true,
                name: "webatlas",
                attribution: '<a href="http://www.geodatenzentrum.de/geodaten/gdz_rahmen.gdz_div?gdz_spr=deu&gdz_akt_zeile=4&gdz_anz_zeile=4&gdz_unt_zeile=0&gdz_user_id=0">© GeoBasis- DE / BKG ('+(new Date).getFullYear()+')</a>',
                id: 'baselayer'
            }),
            topplus:L.tileLayer.wms('https://sgx.geodatenzentrum.de/wms_topplus_web_open', {
                layers: 'web',
                version: '1.3.0',
                format: 'image/png',
                srs:"EPSG:3035",
                transparent: true,
                name: "topplus",
                attribution: '<a href="https://www.bkg.bund.de">TopPlus © GeoBasis- DE / BKG ('+(new Date).getFullYear()+')</a>',
                id: 'baselayer'
            }),
            satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '&copy; Esri',name: "satellite",id: 'baselayer'}),
            osm : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',name: "osm",id: 'baselayer'})
        },
        getParameter:function(){
            if(!urlparamter.getUrlParameter(this.paramter)){
                this.setParamter('webatlas');
            }
            return urlparamter.getUrlParameter(this.paramter);
        },
        setParamter:function(_value){
            urlparamter.setUrlParameter(this.paramter,_value);
        },
        updateParamter:function(_value){
            urlparamter.updateURLParameter(this.paramter,_value);
        },
        removeParamter:function(){
            urlparamter.removeUrlParameter(this.paramter);
        },
        getBaseLayers_sw:function(){
            return {
                "WebAtlas_DE": this.baselayer_sw.webatlas,
                "TopPlus-Web-Open": this.baselayer_sw.topplus,
                "Satellit": this.baselayer_sw.satellite,
                "OSM": this.baselayer_sw.osm,
                "kein Hintergrund": this.baselayer_sw.noBackground
            }
        },
        getBaseLayers_rgb:function(){
            return {
                "WebAtlas_DE": this.baselayer_rgb.webatlas,
                "kein Hintergrund": this.baselayer_sw.noBackground,
                "TopPlus-Web-Open": this.baselayer_rgb.topplus,
                "Satellit":this.baselayer_rgb.satellite,
                "OSM": this.baselayer_rgb.osm
            }
        },
        getAllBaseLayers:function(){
            return $.extend({},this.baselayer_sw,this.baselayer_rgb);
        },
        getBaseLayers_set:function(){
            if(opacity_slider.getOpacity()==0){
                layer_control.state='rgb';
                return this.getBaseLayers_rgb();
            }else{
                layer_control.state='sw';
                return this.getBaseLayers_sw();
            }
        },
        clear:function() {
            map.eachLayer(function (layer) {
                let id = layer.options.id;
                if (id) {
                    if (id === 'baselayer') {
                        layer.removeFrom(map);
                    }
                }
            });
        }
    },
    zusatzlayer:{
        style:'',
        layer:'',
        parameter:'overlays',
        state:false,
        overlays_set : new L.FeatureGroup().on("mouseover",function(){
            this.eachLayer(function(layer){
                layer.bringToBack();
            })}),
        laendergrenzen:new L.GeoJSON('',{
            name: 'laendergrenzen'
        }),
        kreisgrenzen:new L.GeoJSON('',{
            name: 'kreisgrenzen'
        }),
        gemeindegrenzen:new L.GeoJSON('',{
            name: 'gemeindegrenzen'
        }),
        autobahn:new L.GeoJSON('',{
            name: 'autobahn'
        }),
        fernbahnnetz:new L.GeoJSON('',{
            name: 'fernbahnnetz'
        }),
        gewaesser:new L.GeoJSON('',{
            name: 'gewaesser'
        }),
        getState:function(){
            if(this.getLayerGroup_set().length==0){
                return false
            }else{
                return true;
            }
        },
        getParameter:function(){
            return urlparamter.getUrlParameter(this.parameter);
        },
        setParameter:function(){
            let array = [],
                object = this;
            this.overlays_set.eachLayer(function (layer) {
                array.push(layer.options.name);
            });

            if(array.length==0){
                object.removeParamter();
            }
            else if (!this.getParameter()) {
                urlparamter.setUrlParameter(this.parameter, array.toString());
            } else {
                urlparamter.updateURLParameter(this.parameter, array.toString());
            }
        },
        removeParamter:function(){
            urlparamter.removeUrlParameter(this.parameter);
        },
        updateParamter:function(){
            this.removeParamter();
            this.setParameter();
        },
        setStyleSet:function(_style){
            this.style = _style;
        },
        getStyleSet:function(){
            return this.style;
        },
        setForward:function(){
            this.overlays_set.eachLayer(function(layer){
                layer.bringToFront();
            });
        },
        getLayerGroup_set:function(){
            return this.overlays_set;
        }
    },
    getState:function(){
        return this.state;
    },
    open:function(){
        const control = this;
        let lan = language_manager.getLanguage(),
            html=`
             <div class="jq_dialog" id="${this.endpoint_id}">
                <div class="container">
                    <h3 class="well">${this.text[lan].grund}</h3>
                    <div class="maps">
                        <div class="float-left">
                            <div id="topplus" class="image-content cursor base_layers" data-id="topplus">
                                <div class="pic image"></div>
                                <div class="name">Topplus</div>
                            </div>
                            <div id="satellite" class="image-content cursor base_layers" data-id="satellite">
                                <div class="pic image"></div>
                                <div class="name">Satellite</div>
                            </div>
                            <div id="osm" class="image-content cursor base_layers" data-id="osm">
                                <div class="pic image"></div>
                                <div class="name">OSM</div>
                            </div>
                        </div>
                        <div class="float-right">
                            <div id="webatlas" class="image-content cursor base_layers" data-id="webatlas">
                                <div class="pic image"></div>
                                <div class="name">WebatlasDE</div>
                            </div>
                             <div id="leer" class="image-content cursor base_layers" data-id="noBackground">
                                <div class="pic image"></div>
                                <div class="name">${this.text[lan].empty}</div>
                            </div>
                        </div>
                    </div>
                    </div>
                    <div class="container">
                    <h3 class="well">${this.text[lan].extra}</h3>
                    <div class="maps extra-maps">
                        <div class="float-left">
                            <div id="laendergrenzen" class="image-content cursor overlay" data-id="laendergrenzen">
                                <div class="pic extra-image"></div>
                                <div class="name">Ländergrenzen</div>
                            </div>
                            <div id="kreisgrenzen" class="image-content cursor overlay" data-id="kreisgrenzen">
                                <div class="pic extra-image"></div>
                                <div class="name">Kreisgrenzen</div>
                            </div>
                            <div id="gemeindegrenzen" class="image-content cursor overlay" data-id="gemeindegrenzen">
                                <div class="pic extra-image"></div>
                                <div class="name">Gemeindegrenzen</div>
                            </div>
                        </div>
                        <div class="float-right">
                            <div id="autobahn" class="image-content overlay cursor" data-id="autobahn">
                                <div class="pic extra-image"></div>
                                <div class="name">Autobahnnetz (Stand 2015)</div>
                            </div>
                             <div id="fernbahnnetz" class="image-content overlay cursor" data-id="fernbahnnetz">
                                <div class="pic extra-image"></div>
                                <div class="name">Fernbahnnetz (Stand 2016)</div>
                            </div>
                            <div id="gewaesser" class="image-content overlay cursor" data-id="gewaesser">
                                <div class="pic extra-image"></div>
                                <div class="name">Gewässer</div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        `;
        //settings for the manager
        dialog_manager.instructions.endpoint = `${this.endpoint_id}`;
        dialog_manager.instructions.html= html;
        dialog_manager.instructions.title=this.text[lan].title;
        dialog_manager.instructions.modal=false;
        dialog_manager.create();
        try {
            $('.base_layers').each(function(){
                if($(this).data("id")===control.baselayer.getParameter()){
                    $(this).addClass("active");
                }
            });
            $.each(this.zusatzlayer.overlays_set.eachLayer(function (layer) {
                $(`#${layer.options.name}`).addClass('active');
            }));
        }catch(err){}
    },
    init:function(){
        const controller = this;
        this.controller.set();
        //set the baselayer
        if (controller.baselayer.getParameter()) {
            $.each(controller.baselayer.getBaseLayers_set(), function (key, value) {
                if (controller.baselayer.getParameter().indexOf(value.options.name) >= 0) {
                    value.addTo(map);
                }
            });
        }
        //set the zusatzlayer if set
        if(controller.zusatzlayer.getParameter()){
            let array = controller.zusatzlayer.getParameter().split(',');
            $.each(array,function(key_a,value_a){
                controller.controller.setOverlay(value_a);
            });
        }
    },
    remove:function(){
        this.baselayer.clear();
        try {map.removeControl(this.control);} catch (err) {}
    },
    controller:{
        set:function(){
            const control = layer_control;
            $('#map_button').click(function(){
                layer_control.open();
            });
            //on click baselayer
            $(document).on("click",".base_layers",function () {
               let id =  $(this).data("id");
               control.controller.setBaselayer(id);
            });
            //on click overlay
            $(document).on("click",".overlay",function(){
                    let id = $(this).data("id");
                    console.log(id);
                    if($(this).hasClass('active')){
                        control.controller.removeOverlay(id);
                    }else{
                        control.controller.setOverlay(id);
                    }
                });
        },
        setBaselayer:function(_id){
            $.each(layer_control.baselayer.getBaseLayers_set(), function (key, value) {
                if (_id.indexOf(value.options.name) >= 0) {
                    value.addTo(map);
                    value.bringToBack();
                    layer_control.baselayer.updateParamter(_id);
                    dialog_manager.close();
                }else{
                    map.removeLayer(value);
                }
            });
        },
        setOverlay:function(_id){
            const control = layer_control;
            let time = zeit_slider.getTimeSet();
            if(time >= 2016){
                time = 2015;
            }

            progressbar.init();
            progressbar.setHeaderText("Lade layer");

            $.when(request_manager.getZusatzlayer(_id)).done(function(json){
                let layer = control.zusatzlayer[_id],
                    name = function(){
                        $('.overlay').each(function(){
                           if($(this).data("id")===_id){
                               return $(this).find(".name").text();
                           }
                        });
                    };
                layer.addData(json);
                layer.setStyle(style[_id]);
                legende.getLegendeColorsObject().append('<div class="zusatzlayer"><div style="border-bottom: 3px solid '+style[_id].color+';"></div>'+name()+'</div>');
                control.zusatzlayer.getLayerGroup_set().addLayer(layer);
                control.zusatzlayer.setParameter();
                layer.addTo(map);
                control.zusatzlayer.setForward();
                progressbar.remove(dialog_manager.close());
            });
        },
        removeOverlay:function(_id){
            layer_control.zusatzlayer.overlays_set.eachLayer(function(layer){
               let name = layer.options.name;
               if(name === _id){
                   map.removeLayer(layer);
                   layer_control.zusatzlayer.overlays_set.removeLayer(layer);
                   dialog_manager.close();
                   layer_control.zusatzlayer.updateParamter();
               }
            });
        }

    }
};