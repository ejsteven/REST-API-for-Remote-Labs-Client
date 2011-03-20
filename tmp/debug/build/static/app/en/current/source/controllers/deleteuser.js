App.deleteUserController = SC.ArrayController.create(
        SC.CollectionViewDelegate,
{
    errorMessage:'',
    indNum:'',
    /*This function is return the index of the experiments at the fixture*/
    collectionViewShouldSelectIndexes: function(view, indexes, extend) {
        var ind = indexes.get('min');
        this.set('indNum',ind);
        return indexes;
    },//end of collectionView function

    //This function will destroy all the record in the Useredit fixture
    destroyRecords:function(){
        var q =SC.Query.local(App.Useredit);
        var q1 =SC.Query.local(App.Useredit);
        var query=[];
        query[0]=q1;
        query[1]=q1;

        for(var i =0 ; i <query.length; i++){
            var indRec = App.store.find(query[i]);
            indRec.forEach(function (record){
                record.destroy();
            }, this);
        }
    },

    //This function will pop up the delete panel that contains the users 
    deleteUsers:function(){
        var pane = App.getPath('deleteUserPage.mainPane');
        pane.append(); // show on screen
        //send a request to the lab server regarding to the user name
        var authCookie = SC.Cookie.find('SESS');
        SC.Request.getUrl('/rest/userlist')
                .header({
            'Cookie': authCookie.name
        })
                .json()
                .notify(this, this.didGetUserList)
                .send();
    },

    /*Upon receiving a response from the server
     * This function will store the userName list into the Useredit Fixture
     * @response: the data that contain the user lise from the server
     */
    didGetUserList:function(response){
        if (SC.ok(response)){
            var data = response.get('body');
            App.store.createRecords(App.Useredit, data.isEnumerable ? data : [data]);

        }
    },
    //This function will send a request to the server with the user Name to delete that user
    confirm:function()
    {
        try{
            var ind = this.get('indNum');
            if (ind !== '') {
                //get the record from the userEdit fixture
                var indRec = App.store.find(App.Useredit);
                var rec = indRec.objectAt(ind);
                var userName=rec.getEach('user');
                var authCookie = SC.Cookie.find('SESS');
                SC.Request.deleteUrl('/rest/userinfo/'+userName)
                        .header({
                    'Cookie': authCookie.name
                })
                        .notify(this, this.didDeleted)
                        .send();


            }
            else //if no one is selected then throw an error.
                throw SC.Error.desc('Please select any user!');
        }
        catch(err){
            // Set an error message to the user
            this.set('errorMessage', err.message);
        }
    },

    didDeleted:function(response)
    {
        if (SC.ok(response)){
            var data = response.get('body');
            if(data === "Deleted")
            {
                alert("Records has been deleted");
                App.getPath('deleteUserPage.mainPane').remove();
                this.destroyRecords();
            }

        }
    },

    /*This function when is triggered it will do:
     * 1. Destroy all the record that may remain in the fixtures by invoking destroyRecords
     * 2. remove all the panels that are related to the userEdit page
     */
    cancel:function(){
        App.getPath('deleteUserPage.mainPane').remove();
        this.destroyRecords();
    }

});
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('app');