import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController,ToastController} from 'ionic-angular';
import { AuthServiceProvider, ResponseMessage } from '../../providers';

/**
 * Generated class for the GroupserachPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-groupserach',
  templateUrl: 'groupserach.html',
})
export class GroupserachPage {
  public loading: Loading;
  public userData:any;
  public allMyGroup = [];
  public getimageURI:any;
  public search : string;
  public filterData:any;
  public responseData:any;
  constructor(public navCtrl: NavController, 
    public dataService: AuthServiceProvider,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public toastCtrl: ToastController) {
      const loguserDet = JSON.parse(localStorage.getItem('userPrfDet'));
      this.userData=loguserDet;
      this.getimageURI= this.dataService.apiImgUrl();
  }

  ionViewDidLoad() {
    this.getMyGroupList();
  }

  getMyGroupList(){
    //console.log(this.search);
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
    });
    this.loading.present();
    
    if(typeof(this.search) == 'undefined'){
     var filterData = '{"where":{"is_active":true}, "order" : "id desc"}';
    } else {
      var filterData = '{"where": {"name": {"like":"%25'+this.search+'%25"},"is_active":true },"order" : "id desc" }';
    }
    this.dataService.getData('UserGroups?filter='+filterData).then((res:any)=>{
      if(res.length>0){
        res.forEach((datafilter : any, key: any) => {
          res[key].ismember=false;
          let filterJoinData = '{"where":{"group_id":'+datafilter.id+',"customerId":'+this.userData.id+'}}';
          this.dataService.getData('GroupUsers?filter='+filterJoinData).then((res1:any)=>{
            if(res1.length>0){
              res[key].ismember=true;
            }
          },err=>{
          
          })
          let filterData34 = '{"group_id":'+datafilter.id+'}';
          this.dataService.getData('GroupUsers/count?where='+filterData34).then((resct:any)=>{

              res[key].countgrp=resct.count;
          },err=>{

          })
          let grpImg = '';
          if(datafilter.image != null){
            grpImg = this.getimageURI+'group/'+datafilter.image;
          }else{
            grpImg = './assets/img/default.jpeg';
          }
          res[key].image_url=grpImg;
        });
        this.allMyGroup= res;
      }
      //console.log(this.allMyGroup);
      this.loading.dismissAll()
    },err=>{
      this.loading.dismissAll()
    })
  }

  join(id){
    if(id != ''){
      this.loading = this.loadingCtrl.create({
        content: 'Please wait...',
      });
      this.loading.present();
      let JsonData={
        "group_id": id,
        "customerId": this.userData.id
      };
      this.dataService.postData(JsonData,'GroupUsers').then((result) => {
        this.responseData = result;
        if(this.responseData.id){
          let toast = this.toastCtrl.create({
            message: 'You have successfully joined the group.',
            duration: 4000,
            position: 'top'
          });
          toast.present();
          this.navCtrl.push('GroupserachPage');
        }
        this.loading.dismissAll();
      }, (err) => {
        let toast = this.toastCtrl.create({
          message: 'Something Went wrong.Please try again.',
          duration: 4000,
          position: 'top'
        });
        toast.present();
        this.loading.dismissAll();
      });
    } else {
      let toast = this.toastCtrl.create({
        message: 'Please provide id.',
        duration: 4000,
        position: 'top'
      });
      toast.present();
    }
  }

  gotoGroupDetails(gid:any){
    this.navCtrl.setRoot('GroupdetailsPage',{'group_id':gid});
  }
  
  gotoEditGroup(gid:any){
    this.navCtrl.push('EditeventPage',{'group_id':gid});
  }


}
