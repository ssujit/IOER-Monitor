//Indikatorauswahl
const indikatorauswahl ={
    possebilities:'',
    all_possible_years:'',
    filtered_years:'',
    paramter:'ind',
    previous_indikator:'',
    schema:{
        "N":{"name":"Nachhaltigkeit","icon":"<i class='leaf icon'></i>","color":false},
        "S":{"name":"Siedlung","icon":false,"color":"#fceded"},
        "V":{"name":"Verkehr","icon":false,"color":"#ededfd"},
        "F":{"name":"Freiraum","icon":false,"color":"#ecf3db"},
        "B":{"name":"Bevölkerung","icon":"<i class='male icon'></i>","color":false},
        "D":{"name":"Zersiedelung","icon":"<i class='spinner icon'></i>","color":false},
        "G":{"name":"Gebäude","icon":"<i class='home icon'></i>","color":false},
        "L":{"name":"Landschafts- und Naturschutz","icon":"<i class='bug icon'></i>","color":false},
        "U":{"name":"Landschaftsqualität","icon":"<i class='heart icon'></i>","color":false},
        "O":{"name":"Ökosystemleistungen","icon":"<i class='umbrella icon'></i>","color":false},
        "R":{"name":"Risiko","icon":"<i class='exclamation icon'></i>","color":false},
        "E":{"name":"Energie","icon":"<i class='bolt icon'></i>","color":false},
        "M":{"name":"Materiallager","icon":"<i class='cubes icon'></i>","color":false},
        "X":{"name":"Relief","icon":"<i class='align right icon'></i>","color":false}
    },
    getPreviousIndikator:function(){
        return this.previous_indikator;
    },
    getSelectedIndikator:function(){
        return urlparamter.getUrlParameter(this.paramter);
    },
    getIndikatorKategorie:function(_ind){
        return $('#'+_ind+"_item").attr("data-kat");
    },
    getSelectedIndikatorKategorie:function(){
        return $('#'+this.getSelectedIndikator()+"_item").attr("data-kat");
    },
    setIndikatorParameter:function(_value){
        urlparamter.setUrlParameter(this.paramter, _value);
    },
    getIndikatorEinheit:function(){
        let value =this.getIndikatorInfo(this.getSelectedIndikator(),"unit");
        if(typeof value ==='undefined' || value===''){
            value = '';
        }
        return value;
    },
    getSelectedIndiktorGrundaktState:function(){
        let value = $('#'+this.getSelectedIndikator()+'_item').data('actuality');
        return value === 'verfügbar';
    },
    updateIndikatorParamter:function(_value){
        urlparamter.updateURLParameter(this.paramter, _value);
    },
    getAllPossibleYears:function(){
        return this.all_possible_years;
    },
    getFilteredPossibleYears:function(){
        return this.filtered_years;
    },
    getPossebilities:function(){
        return this.possebilities;
    },
    getDOMObject:function(){
        $elem = $('#indicator_ddm');
        return $elem;
    },
    init:function(){
        this.fill();
        this.controller.set();
    },
    isVisible:function(){
        return this.getDOMObject().is(':visible');
    },
    fill:function(){
        const menu = this;
        //get all possebilities via ajax
        $.when(request_manager.getAllAvaliableIndicators()).done(function(data){
            menu.possebilities = data;
            let container = $('#kat_auswahl');
            let html = "";
            //fill the Options
            $.each(data,function(cat_key,cat_value){
                let cat_id = cat_key,
                    cat_name=function(){
                        let cat_name = cat_value.cat_name;
                        if(language_manager.language==="en"){
                            cat_name = cat_value.cat_name_en
                        }
                        return  cat_name;
                    },
                    color = menu.schema[cat_id]["color"],
                    icon= menu.schema[cat_id]["icon"],
                    background_color = '',
                    icon_set = '';

                if(color){
                    background_color="background-color:"+color+";";
                }else{
                    icon_set=icon;
                }

                if(main_view.getWidth()>=500) {
                    html += '<div id="kat_item_'+cat_id+'" class="ui left pointing dropdown link item link_kat" value="' + cat_id + '" style="'+background_color+'">'+icon_set+'<i class="dropdown icon"></i>' + cat_name() + '<div id="submenu' + cat_id + '" class="menu submenu upward">';
                }else{
                    html += '<div class="header">' +
                        '      <i class="tags icon"></i>'+cat_name()+'</div>' +
                        '    <div class="divider"></div>'
                }
                $.each(cat_value.indicators, function (key, value) {
                    let ind_id = key,
                        ind_name=function(){
                            let ind_name = value.ind_name;
                            if(language_manager.language==="en"){
                                ind_name = value.ind_name_en
                            }
                            return  ind_name;
                        },
                        markierung = value.significant,
                        grundakt_state = value.basic_actuality_state,
                        einheit = value.unit,
                        times = value.times;
                    if (markierung === 'true') {
                        html += '<div class="indicator_ddm_item_bold item link_sub" id="' + ind_id + '_item' + '" data-times="'+times+'" data-einheit="'+einheit+'" data-value="' + ind_id + '" value="' + ind_id + '" data-kat="' + cat_id + '" data-name="' + ind_name() + '" data-sort="1" data-actuality="'+grundakt_state+'">';
                    } else {
                        html += '<div class="item link_sub" id="' + ind_id + '_item' + '" data-times="'+times+'" data-einheit="'+einheit+'" data-value="' + ind_id + '" value="' + ind_id + '" data-kat="' + cat_id + '" data-name="' + ind_name() + '" data-sort="0" data-actuality="'+grundakt_state+'">';
                    }
                    html += ind_name() + "</div>";
                });
                html +='</div></div>';
            });
            container.empty().append(html);
            //sort by attribute 'markierung'
            $(container).find('div').sort(function(a,b){
                let contentA =parseInt( $(a).attr('data-sort'));
                let contentB =parseInt( $(b).attr('data-sort'));
                return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
            });
        })
        //append 'Siedlungsdicht for Herr Dr. Meinel'
            .then(function() {
                    $('#B02DT_item').clone().appendTo('#submenuN');
                }
            );
    },
    checkAvability:function(_ind,draw){
        let ind = this.getSelectedIndikator();
        const menu = this;
        if(_ind){ind = _ind;}
        $.when(request_manager.getAvabilityIndicator(ind)).done(function(data){
            $.each(data,function(key,value) {
                if(value.ind === ind) {
                    if(value.avability==false){
                        alertNotAsRaster();
                        $('.raster_export').hide();
                        return false;
                    }else{
                        if(!ind){
                            menu.setIndikatorParameter(ind);
                        }else{
                            menu.updateIndikatorParamter(ind);
                        }
                        if(draw){
                            menu.setIndicator(ind);
                        }
                        $('.raster_export').show();
                        return true;
                    }
                }
            });
        });
    },
    setIndicator:function(indicator_id){
        const menu = this;

        let ind_param = menu.getSelectedIndikator();
        if (!ind_param) {
            menu.setIndikatorParameter(indicator_id);
        } else {
            menu.updateIndikatorParamter(indicator_id);
        }
        $('#ind_choice_info').css({"color": "black", "font-weight": "bold"});
        $('.kennblatt').show();
        //reset the first init layer
        if(start_map.getState()){
            start_map.remove();
        }
        farbschema.reset();
        //reset error code
        error_code.setErrorCode(false);
        legende.init(true);
        $.when(request_manager.getJahre(indicator_id)).done(function(data_time){
            menu.all_possible_years = data_time;
            let years_selected = [];
            $.each(data_time,function(key,value){
                if(value<helper.getCurrentYear()){
                    years_selected.push(value);
                }
            });
            menu.filtered_years = years_selected;
            zeit_slider.init(years_selected);
            $.when(request_manager.getRaumgliederung(indicator_id)).done(function(data_raum){
                raeumliche_analyseebene.init(data_raum);
            });
        });
        //reset highlight
        $('.item').each(function () {
            $(this).css({"color": "rgba(0,0,0,.87)", "font-weight": ""})
        });
        //highlight the elements inside the menu
        $('#kat_item_'+menu.getIndikatorKategorie(indicator_id)).css({"color": farbschema.getColorMain(), "font-weight": "bold"});
        $('#'+indicator_id+"_item").css({"color": farbschema.getColorMain(), "font-weight": "bold"});
    },
    getIndikatorInfo:function(indicator_id,key_name){
        let val_found = null;
        $.each(this.getPossebilities(),function(cat_key,cat_value){
            $.each(cat_value.indicators, function (key, value) {
                if(key===indicator_id){
                    val_found = value[key_name];
                }
            });
        });
        return val_found;
    },
    getSelectedIndikatorText:function(){
        const menu = this;
        let name = this.getDOMObject().dropdown('get text');
        if(name.toLowerCase().indexOf("bitte")===0 || menu.getSelectedIndikator() !== menu.previous_indikator){
            setTimeout(function(){
                name = $('#'+menu.getSelectedIndikator()+"_item").text();
                menu.setSelectedIndikatorText(name);
            },1000);
        }
        return name;
    },
    setSelectedIndikatorText:function(value){
        this.getDOMObject().dropdown('set text',value);
    },
    getSelectedIndikatorText_Lang:function(){
        //just as control mechanism
        this.getSelectedIndikatorText();
        return $('#'+this.getSelectedIndikator()+"_item").attr("data-name");
    },
    cloneMenu:function(appendToId,newClassId,orientation,exclude_kat,possible_indicators){

        $('.'+newClassId).remove();

        let target_ddm = $('.link_kat');
        if(target_ddm.length===0){
            target_ddm = $('.link_sub');
        }

        target_ddm.each(function(){
            $(this)
                .clone()
                .appendTo('#'+appendToId)
                .removeClass('link_kat')
                .addClass(newClassId);
        });

        $('.'+newClassId).
        each(function() {
            let element = $(this);
            let kat = $(this).attr("value");
            let time = zeit_slider.getTimeSet();
            //add  the needed classes and change the id
            element
                .find('i')
                .addClass(orientation);
            element
                .find('.submenu')
                .addClass(orientation)
                .addClass('transition')
                .removeAttr("id")
                .attr('id', 'submenu'+kat+newClassId)
                .find('.item').each(function(){
                //if true clone only indicators which times are possible with the indicator set times
                if(possible_indicators){
                    let times_values = $(this).data("times").toString().split(',');
                    let kat_name = $(this).data("kat");
                    let time = zeit_slider.getTimeSet().toString();
                    if($.inArray(time,times_values)===-1){
                        $(this).remove();
                    }
                }
            })
        });

        //remove empty kats
        $(' .'+newClassId).each(function(){
            if($(this).find('.item').length ==0){
                $(this).remove();
            }
        });

        //set the align css for the menu
        let text_align = 'left';
        if(orientation==='left'){
            text_align = 'right';
        }
        $('#'+appendToId+' >.item').css('text-align',text_align);

        //remove a excluded Kat
        if(exclude_kat){
            if(exclude_kat instanceof Array){
                $.each(exclude_kat,function(key,value){
                    $('.' + newClassId + "[value=" + value + "]").remove();
                });
            }else {
                $('.' + newClassId + "[value=" + exclude_kat + "]").remove();
            }
        }
    },
    openMenu:function(){
        this.getDOMObject().dropdown('show');
    },
    controller:{
        set:function(){
            indikatorauswahl.getDOMObject()
                .dropdown('refresh')
                .dropdown({
                    onChange: function (value, text, $choice) {
                        //clean the search field
                        $('#search_input_indikatoren').val('');
                        //save the prev selected indicator as paramter
                        indikatorauswahl.previous_indikator=value;
                        indikatorauswahl.setIndicator(value);
                        if (raeumliche_visualisierung.getRaeumlicheGliederung() === 'gebiete') {
                            farbliche_darstellungsart.resetSelection();
                            dev_chart.chart.controller.clearChartArray();
                            expand_panel.close();
                        }
                    },
                    onHide: function () {
                        helper.resetHighlightElementByID('indicator_ddm');
                    }
                });
        }
    }
};