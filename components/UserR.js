import React from 'react'; 

import StoreBlkSliderHref from '../components/StoreBlkSliderHref';
import StoreBlkSlider from '../components/StoreBlkSlider';

export default class UserR extends React.Component {
   render() {
      return (
         <div className="well container">
            <div className="row center-align-text">
               <div className="col-md-12">
                  <h4 className="text-primary">Find out more from your record</h4>
               </div>
               <div className="col-md-12 center-align-text-item">
                  <span className="text-warning">Get Restaurants Suggestions After logging in:</span>
               </div>
            </div>
            <LogInForm wholeSet={this.props.wholeSet}/>
            
         </div>
      );
   }
}


class LogInForm extends React.Component{
   constructor(props) {
      super(props);
      
      this.state = {
         email:"",
         password:"",
         data: [],
         users:[
            {email:'test@m.c',password:'test',reviews:[{name:'r1',rate:4}]},
            {email:'chin@m.c',password:'test',reviews:[{name:'r4',rate:5},{name:'r5',rate:1}]}
         ],
         currentuser:[],
         recommend:[],
         loginResults: false
      }

      this.updateState = this.updateState.bind(this);
      this._onChange = this._onChange.bind(this);
      this._logOff = this._logOff.bind(this);
      this._Cal = this._Cal.bind(this);
   };

   _Cal(visited_all,selected_visit){
      var categories_high=[],unvisited = [],result = [];
      this.props.wholeSet.map(function(r){
         if(selected_visit.length>0){
            if(_.indexOf(visited_all,r.name)>-1){
               if(_.indexOf(selected_visit,r.name)>-1){categories_high.push(r.categories);}
            }else{unvisited.push(r);}
         }else{
            if(_.indexOf(visited_all,r.name)==-1){
               unvisited.push(r);
            }
         }
      });
      categories_high=_.flatten(categories_high);
      //console.log(categories_high);
      _.map(unvisited,function(x){
         if(selected_visit.length>0){
            if(x.stars>=3){
               if(_.intersection(x.categories,categories_high).length>0){
                  result.push(x);
               }
            }
         }else{
            if(x.stars>3){
               result.push(x);
            }
         }
      });
      return result;
   }
   updateState(e) {
      e.preventDefault();
      var email = this.state.email;
      var pswd = this.state.password;
      var tempcurrent = this.state.users.filter(function(u){return (u.email==email&&u.password==pswd);});
      if(tempcurrent.length>0){
         this.setState({currentuser:tempcurrent});
         //or maybe pipe to somewhere else
         
         var visited_all = _.map(tempcurrent[0].reviews,function(R){return R.name;});
         var visited_high = _.filter(tempcurrent[0].reviews,function(R){return (R.rate>=3);});
         visited_high = _.map(visited_high,function(R){return R.name;});

         var tempResult = this._Cal(visited_all,visited_high);
         
         if(tempResult.length==0){
            var visited_low = _.difference(visited_all,visited_high);
            if(visited_low.length>0){
               tempResult = this._Cal(visited_all,visited_low);
            }
         }
         if(tempResult.length==0){
            tempResult = this._Cal(visited_all,[]);
         }
         this.setState({recommend:tempResult});
         this.setState({ loginResults: true });
      }
   }
   _onChange(e) {
      var state = {};
      state[e.target.name] =  e.target.value;
      this.setState(state);
   }
   _logOff(e){
      if(this.state.email!==""&&this.state.password!==""){
         var initial =  {
         email:"",
         password:"",
         data: [],
         users:[
            {email:'test@m.c',password:'test',reviews:[{name:'r1',rate:4}]},
            {email:'chin@m.c',password:'test',reviews:[{name:'r4',rate:5},{name:'r5',rate:1}]}
         ],
         currentuser:[],
         recommend:[],};
         this.setState(initial);
      }
   }
   render() {
      return (
         <div>
            <form className="form-inline " id="usrForm" onSubmit= {this.updateState}>
            <div className="form-group row">
               <div className="input-group col-md-push-2 col-md-4">
                     <label className="input-group-addon">Email</label>
                     <input type="email" name="email" className="form-control" onChange = {this._onChange} 
                     />
               </div>
               <div className="input-group col-md-push-2  col-md-4">
                     <label className="input-group-addon">Password</label>
                     <input type="password" name="password" className="form-control" onChange = {this._onChange} 
                      />
               </div>
               <div className="form-group text-center btn-row">
               { this.state.loginResults ?null:<button className="btn btn-primary form-control" type="submit" value="submit">Log In</button>}
               { this.state.loginResults ? <button className="btn btn-info form-control" type="reset" onClick={this._logOff}>Log Off</button>: null }
               <button className="btn btn-primary form-control" onClick={this._logOff} disabled>Register</button>
               </div>
               <div>
            {this.state.recommend.length>0?<StoreBlkSlider wholeSet={this.state.recommend} block={'user-'}/>:<p className="notification"><b>You may Try: </b><span className="user-sug">User 1</span>email:<b>test@m.c</b> password:<b>test</b>  <span className="user-sug">User 2</span>email:<b>chin@m.c</b> password:<b>test</b></p>}
            </div>
            </div>
            </form>
            
        
         </div>
      );
   }
}