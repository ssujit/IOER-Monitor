
const area_info={
    parameters:{ // all the necessary Values, assigned in getAllParameters function
        endpoint_id: "",
        ags:"",
        name:"",
        data:[],
        lan:"",
        time:0
    },

    text:{ // Translation         ACHTUNG! The translation entry keys have to have the same name as the corresponding table column names ( see function area.info.extractRelevantDataFromJSON() )
        de:{
            title:"Gebietsprofil",
            time: "Zeitpunkt",
            indicatorValues:"Alle Indikatorwerte für: ",
            download:"Herunterladen als .csv",
            category:"Kategorie",
            indicator:"Indikator",
            value:"Wert",
            relevanceYear:"Aktualität",
            comparison:"Wergleich mit: ",
            germany:"Deutschland",
            region:"Kreis",
            difference:"Differenz"
        },
        en:{
            title:"Area information",
            time: "Time",
            indicatorValues:"All indicator values for: ",
            download:"Download as .csv",
            category:"Category",
            indicator:"Indicator",
            value:"Value",
            relevanceYear:"Topicality",
            comparison:"Comparison with:",
            germany: "Germany",
            region: "Kreis",
            difference:"Difference"
        }
    },

    open:function(ags,gen){
        this.parameters=this.getAllParameters(ags, gen); // getting the regular Parameters
        let columnList=["category","indicator", "value", "relevanceYear","valueBRD", "differenceToBRD"]; // list of data columns that should be displayed in the Table - used to sort the data
                                                                                                             // -- ACHTUNG!! Has to be the same as the column names defined in function area_info.prepareDataForTAble() !

        $.when(RequestManager.getSpatialOverview(indikatorauswahl.getSelectedIndikator(),ags).done(function(data){    // Fetching the data. Async function, waiting for results before continuing
                data= area_info.extractRelevantDataFromJSON(data,area_info.parameters.lan);
                area_info.parameters.data=data;
                let html= area_info.writeHTML(area_info.parameters,area_info.text);
                area_info.createDialogWindow(area_info.parameters,html,area_info.text);
                area_info.initDropdown(area_info.parameters,area_info.text);
                area_info.drawTable(data,area_info.parameters.lan,area_info.text,columnList);
                area_info.prepareDataForTable(data);
            })
        );



    },
    initDropdown:function(parameters, text){  // controls the dropdown menu
        const comparison_dropdown=$("#comparison_ddm");
        comparison_dropdown.dropdown({
            onChange: function (value) {
                let columnList=[];
                switch (value) {
                    case "germany":

                        columnList=["category","indicator", "value", "relevanceYear","valueBRD", "differenceToBRD"];
                        area_info.drawTable(parameters.data,parameters.lan, text, columnList);
                        comparison_dropdown.dropdown("hide");
                        console.log("Redrawing table: Germany" );
                        break;

                    case "region":
                        columnList=["category","indicator", "value", "relevanceYear","valueKreis", "differenceToKreis"];
                        area_info.drawTable(parameters.data,parameters.lan, text, columnList);
                        comparison_dropdown.dropdown("hide");
                        console.log("Redrawing table: Kreis" );
                        break;
                    default:
                        alert("Error, no chart Type selected!")

                }
            }
        })

    },

    getAllParameters:function(ags,gen){ // fills the Parameter Object with variables
        let parameters={
            endpoint_id:"area_info_content",
            ags:"",
            name:"",
            data:[],
            lan:"",
            time:0};


        parameters.ags=ags;
        parameters.name=gen;
        parameters.lan=language_manager.getLanguage();
        parameters.time=zeit_slider.getTimeSet();
        return parameters;
    },


    extractRelevantDataFromJSON:function(data, lan){ // prepares the raw data for visualisation in a Table- creates single rows (objects) for each Indicator
        let tableData=[];
        for (let index in data){
            let catalogIndex = toString(Object.keys(data[index]));
            for (let category in data[index]) {
                let categoryName=" ";

                if (lan=="de" ){ // check for Language!!!
                    categoryName=data[index][category]["cat_name"];
                }
                else{
                    categoryName=data[index][category]["car_name_en"];
                }
                for (let indicator in data[index][category]["values"]){
                    indikatorauswahl.getIndikatorInfo(data[index][category]["values"][indicator]["id"],"name");
                    let indicatorId=data[index][category]["values"][indicator]["id"],
                        indicatorName="",
                        indicatorText="";
                    if (lan=="de"){
                        indicatorName=indikatorauswahl.getIndikatorInfo(data[index][category]["values"][indicator]["id"],"ind_name");
                        indicatorText=indikatorauswahl.getIndikatorInfo(data[index][category]["values"][indicator]["id"],"info");
                    }
                    else if (lan=="en"){
                        indicatorName=indikatorauswahl.getIndikatorInfo(data[index][category]["values"][indicator]["id"],"ind_name_en");
                        indicatorText=indikatorauswahl.getIndikatorInfo(data[index][category]["values"][indicator]["id"],"info_en");
                    }
                    else{
                        console.log("Language not recognised! Area_info.js")
                    }
                    let tableRow={
                        category:categoryName,
                        id:indicatorId,
                        indicator:indicatorName,
                        indicatorText:indicatorText,
                        value:this.roundNumber(indicatorId,data[index][category]["values"][indicator]["value"]), // Value gets rounded based on the Indicator decimal spaces
                        unit:data[index][category]["values"][indicator]["einheit"],
                        relevanceYear:data[index][category]["values"][indicator]["grundakt_year"],
                        relevanceMonth:data[index][category]["values"][indicator]["grundakt_month"],
                        relevanceYearBRD:data[index][category]["values"][indicator]["grundakt_year_brd"],
                        relevanceMonthBRD:data[index][category]["values"][indicator]["grundakt_month_brd"],
                        valueBRD:this.roundNumber(indicatorId,data[index][category]["values"][indicator]["value_brd"]),  // Value gets rounded based on the Indicator decimal spaces
                        differenceToBRD:this.roundNumber(indicatorId,data[index][category]["values"][indicator]["diff_brd"]),  // Value gets rounded based on the Indicator decimal spaces
                        relevanceYearKreis:data[index][category]["values"][indicator]["grundakt_year_krs"],
                        relevanceMonthKreis:data[index][category]["values"][indicator]["grundakt_month_krs"],
                        valueKreis:this.roundNumber(indicatorId, data[index][category]["values"][indicator]["value_krs"]),
                        differenceToKreis:this.roundNumber(indicatorId,data[index][category]["values"][indicator]["diff_krs"])
                    };
                    categoryName=" ";
                    tableData.push(tableRow);
                }
            }


        }
        return tableData;

    },

    // TODO REINIS CONTINUE HERE, create stringified, concatenated data fields
    prepareDataForTable:function(data){   // stringifies the fields, adds units to some of the fields (value, valueDRD...)
        for (let row in data) {
            data[row]["value"] = data[row]["value"] + " " + data[row]["unit"];
            console.log(data[row]["value"]);
            }
        },

    selectColumnsForTable:function(data, columnList){
        let newTableColumns=[];
        for (let elem in data){
            let tableRow=[];
            for (let columnName in columnList){
                let column=data[elem][columnList[columnName]];
                console.log("Got Column: "+ column);
                tableRow.push(column)
            }
            newTableColumns.push(tableRow)
        }
        return newTableColumns;
    },

    writeHTML:function(parameters, text){
        return he.encode(`
        <div class="jq_dialog" id="${parameters.endpoint_id}">
            <div class="flex" id="area_info_container">
                    <div > 
                        <div class="flex" >             
                        <h2 class="flexElement">${text[parameters.lan].indicatorValues}</h2>
                        <h2 class="flexElement"> ${parameters.name}</h2>
                        <h3 class="flexElement" style="color: slategray"> (AGS: ${parameters.ags})</h3>
                        </div> 
                    
                    <h3 class="flexElement"> ${text[parameters.lan].time}: ${parameters.time}</h3>
                    </div>
                    <button class="downloadButton">
                        ${text[parameters.lan].download}
                    </button>                                    
            </div>
            <br/>
            <hr />
            <table id="dataTable" class="display" width="90%">
                    <thead>
                    <tr id="firstHeaderRow">
                    <th>${text[parameters.lan].category}</th>
                    <th>${text[parameters.lan].indicator}</th>
                    <th>${text[parameters.lan].value}</th>
                    <th>${text[parameters.lan].relevanceYear}</th>
                    <th>${text[parameters.lan].comparison}</th>
                    <th class="composite">${text[parameters.lan].difference}</th>
                </tr>
                
                <tr id="secondHeaderRow">
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th>   
                        <div id="comparison_ddm" class="ui selection dropdown">
                            <i class="dropdown icon"></i>
                            <div class="text">${text[parameters.lan].germany}</div>
                            <div class="menu">
                                <div class="item" data-value="germany">${text[parameters.lan].germany}</div>
                                <div class="item" data-value="region">${text[parameters.lan].region}</div>
                            </div>
                        </div>                     
                    </th>
                    <th></th>
                    
                </tr>
        </thead>
</table>
        </div>
        `);
    },

    createDialogWindow:function(parameters, html, text){
        //setting up the dialog Window
        dialog_manager.instructions.endpoint = `${parameters.endpoint_id}`;
        dialog_manager.instructions.html = html;
        dialog_manager.instructions.title = text[parameters.lan].title;
        dialog_manager.create();
    },

    drawTable:function(data, lan, text, columnList){
        let tableData=area_info.selectColumnsForTable(data,columnList),  // getting only the data required for the Table
            language=area_info.getDataTablesLanguage(lan);

        $("#dataTable").DataTable(
            {
                destroy:true,   // destroys the old table before redrawing. Not the most efficient way, though. Consider using dataTables.api
                responsive: true,
                data:tableData,
                "ordering": false,  // disable the ordering of rows
                "createdRow": function ( row, data, index ) {   // formatting the row at draw time! difference Row @ runtime
                },
                "language":language,
                "pageLength": 25,
            }
        );
    },


    getDataTablesLanguage:function(lan){   // returns the DataTables interface translations
        let language={};  // get the language translations @: http://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/
        switch (lan) {
            case "de":
                console.log("Deutsch sein!!!")
                language={
                    search: "Suchen",
                    lengthMenu:    "_MENU_ Einträge anzeigen",
                    info:           "_START_ bis _END_ von _TOTAL_ Einträgen",
                    infoEmpty:      "Keine Daten vorhanden",
                    infoFiltered:   "(gefiltert von _MAX_ Einträgen)",
                    infoPostFix:    "",
                    loadingRecords: "Wird geladen ..",
                    zeroRecords:    "Keine Einträge vorhanden",
                    paginate: {
                        first:      "Erste",
                        previous:   "Zurück",
                        next:       "Nächste",
                        last:       "Letzte",

                    },
                };
                break;
            default:
                console.log("Untermenschlich!!");
                break;
        }
        return language;
    },

    roundNumber:function(indicatorId,number){
        let decimalSpaces=indikatorauswahl.getIndikatorInfo(indicatorId,"rundung");
        return Math.round(parseFloat(number) * Math.pow(10, decimalSpaces)) / Math.pow(10, decimalSpaces)
    },

};
