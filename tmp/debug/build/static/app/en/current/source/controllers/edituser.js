// ==========================================================================
// Project:   REST API FOR REMOTE LABS
// Copyright:CEIT
//Developer : Omar Alkylaney
// App.edituserController
// ==========================================================================

App.edituserController = SC.ArrayController.create(
    SC.CollectionViewDelegate,
    /** @scope App.edituserController.prototype */ {
        errorMessage:'',
        firstName:'',
        lastName:'',
        course:'',
        uni:'',
        userName:'',
        indNum:'',
        expListData:[SC.Object.create({})] ,

        //This function is to clear all the field from the Editing pages
        clearFields:function(){
            this.set('errorMessage','');
            this.set('firstName','');
            this.set('lastName','');
            this.set('course','');
            this.set('uni','');
        },

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

        /*This function is return the index of the experiments at the fixture*/
        collectionViewShouldSelectIndexes: function(view, indexes, extend) {
            var ind = indexes.get('min');
            this.set('indNum',ind);
            return indexes;
        },//end of collectionView function
        
        /** This function will append the userEditing page on the screen
     *  and it will send a request to grab all the user name from the lab server.
     **/
        edit:function(){
            var pane = App.getPath('editingUserPage1.mainPane');
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
            //    var len=data.getEach('user').length;
             //   for(var i = 0 ; i < len; i++){
             //       data[i].isDone = false;
            //    }
                App.store.createRecords(App.Useredit, data.isEnumerable ? data : [data]);
            }
        },


        /**This function will remove the editingUserPage1 panel and append the
     * the editingUserPage2 panel..
     * It will send a request to the lab server to grab all the information that
     * is related to the user that has been selected
     **/
        nextToEditUserPage2:function(){
            try{
                var ind = this.get('indNum');
                if (ind !== '') {
                    //get the record from the userEdit fixture
                    var indRec = App.store.find(App.Useredit);
                    var rec = indRec.objectAt(ind);
                    this.set('userName', rec.getEach('user'));
                    //remove the edit first page and append the second page
                    App.getPath('editingUserPage1.mainPane').remove();
                    var pane = App.getPath('editingUserPage2.mainPane');
                    pane.append();
                    //send a request to the lab server regarding to the user info
                    var authCookie = SC.Cookie.find('SESS');
                    SC.Request.getUrl('/rest/userinfo/'+this.get('userName'))
                    .header({
                        'Cookie': authCookie.name
                    })
                    .json()
                    .notify(this, this.didGetUserInfo)
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

        /* Upon receiving a response from the server, this function will display
     *  the user info in the editingUserPage2
     *  @response: the data that contain the user info from the server
     */
        didGetUserInfo:function(response){
            if(SC.ok(response)){
                var data = response.get('body');
                this.set('firstName',data.getEach('first'));
                this.set('lastName',data.getEach('last'));
                this.set('course',data.getEach('course'));
                this.set('uni',data.getEach('uni'));
            }
        },

        /**This function will do will send a request to get the experiment list
      * from  the lab server.
     **/
        nextToEditUserPage3:function(){
            //send a request to the lab server regarding to the experiment list
            var authCookie = SC.Cookie.find('SESS');
            var user=this.get('userName');
            SC.Request.getUrl('/rest/checklist/'+user)
            .header({
                'Cookie': authCookie.name
            })
            .json()
            .notify(this, this.didGetExpList)
            .send();            
        },        

        /*Upon receiving a response from the server, this function will,
     * 1. Display the experiment list in the list view .
     * 2. Remove the editingUserPage3 panel and append the editingUserPage3 panel
     * @response: the data that contain the user info from the server
     */
        didGetExpList:function(response){
            if(SC.ok(response)){
                var data = response.get('body');
                //store this data to the Admin_expList fixture
                App.store.createRecords(App.Admin_expList, data.isEnumerable ? data : [data]);

                //get the data from the Admin_expList fixture 
                var expListQuery = SC.Query.local(App.Admin_expList,
                {
                    orderBy:'expName'
                });
                var expList = App.store.find(expListQuery);
                this.set('expListData',expList);
                //remove the editingUserPage2 and append the editingUserPage3
                App.getPath('editingUserPage2.mainPane').remove();
                var pane = App.getPath('editingUserPage3.mainPane');
                pane.append();
            }
        },

        /* This function will do:
         * 1. Send both requests(PUTURL[userInfor], PUTURL[expList]) to the lab server
         * 2.
         **/
        submit:function(){
            var userAccount=[{
                "first":this.get('firstName'),
                "last":this.get('lastName'),
                "course":this.get('course'),
                "uni":this.get('uni')
            }];
            //find the cookie
            var authCookie = SC.Cookie.find('SESS');
            //get the record from the admin_expList fixture
            var query = SC.Query.local(App.Admin_expList);
            var exp = App.store.find(query);
            var len=exp.getEach("isDone").length;
            var expList=[];
            var isDone=exp.getEach("isDone");

            //send a PUT request to the lab server that contain the user information
            SC.Request.putUrl('/rest/userinfo/' + this.get('userName'))
            .header({
                'Cookie': authCookie.name
            })
            .json()
            .notify(this, this.didUpdated)
            .send(userAccount);

            //loop through the fixtures and see which exp is been selected
            //if the exp been selected then add it to the expList
            for(var i =0 ; i < len; i++  ){
                if(isDone[i] === true){
                    expList.insertAt(expList.length, exp.getEach("expID")[i]);
                }
            }

            //send a PUT request to the lab server that contain all the experiments
            //that have been selected.
            var userList=[{
                expList:expList
            }];

            SC.Request.putUrl('/rest/explist/' + this.get('userName'))
            .header({
                'Cookie': authCookie.name
            })
            .json()
            .notify(this, this.didUpdated)
            .send(userList);
        },

        /* Upon recieving the response from the lab server, this function will :
         * 1. show a windows message that consist ("This user name has been updated .")
         * 2. Initialize all the parameters by invoking clearFields
         * 3. Destroy all the record that may remain in the fixtures by invoking destroyRecords
         * 4. remove all the panels that are related to the userEdit page
         */
        didUpdated:function(response){
            if (SC.ok(response)){
                    alert("This user has been updated");
                    App.getPath('editingUserPage1.mainPane').remove();
                    App.getPath('editingUserPage2.mainPane').remove();
                    App.getPath('editingUserPage3.mainPane').remove();
                    this.clearFields();
                    this.destroyRecords();               
            }
        },

        /*This function when is triggered it will do:
         * 1. Initialize all the parameters by invoking clearFields
         * 2. Destroy all the record that may remain in the fixtures by invoking destroyRecords
         * 3. remove all the panels that are related to the userEdit page
         */
         cancel:function(){
            App.getPath('editingUserPage1.mainPane').remove();
            App.getPath('editingUserPage2.mainPane').remove();
            App.getPath('editingUserPage3.mainPane').remove();
            this.clearFields();
            this.destroyRecords();
        }

    });
; if ((typeof SC !== 'undefined') && SC && SC.scriptDidLoad) SC.scriptDidLoad('app');