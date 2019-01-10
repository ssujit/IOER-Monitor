const progressbar ={
    active: false,
    getContainer:function(){return $('#progress_div');},
    getTextContainer:function(){return $('#progress_header');},
    init:function(){
        const object = this;
        if(this.active===false) {
            $('body').append('<div id="progress_div"><h2 id="progress_header"></h2><div class="progress"></div><hr/><button type="button" class="btn btn-primary" id="abort_btn">Abbrechen</button></div>');
            this.getContainer().show();
            modal_layout.init();
            this.active = true;
        }
        $(document).on("click","#abort_btn",function(){
            request_manager.cancel();
            object.remove();
        });
    },
    remove:function(callback){
        modal_layout.remove();
        this.active = false;
        this.getContainer().remove();
        if(callback)callback();
    },
    setHeaderText:function(html_string){
        this.getTextContainer()
            .empty()
            .text(html_string)
    }
};