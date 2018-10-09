import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController} from 'ionic-angular';
import { AuthServiceProvider, ResponseMessage } from '../../providers';
/**
 * Generated class for the GroupdetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-groupdetails',
  templateUrl: 'groupdetails.html',
})
export class GroupdetailsPage {
  public groupId:any;
  public pet:string = 'group';
  public loading: Loading;
  public getimageURI:any;
  public userData:any;
  public groupDetails:any;
  public message:string = '';
  public allCommentList = [];
  public groupTag = [];

  constructor(
    public navCtrl: NavController, 
    public dataService: AuthServiceProvider,
    public loadingCtrl: LoadingController,
    public navParams: NavParams
  ) {
    this.groupId = this.navParams.get('group_id');
    const loguserDet = JSON.parse(localStorage.getItem('userPrfDet'));
    this.userData=loguserDet;
    this.getimageURI= this.dataService.apiImgUrl();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad GroupdetailsPage');
    this.getGroupDetails();
    this.getAllComment();
    this.getGroupTagList();
  }

  getGroupDetails(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
    });
    this.loading.present();
    this.dataService.getData('UserGroups/'+this.groupId).then((res:any)=>{
        
        let grpImg = '';
        if(res.image != null){
          grpImg = this.getimageURI+'group/'+res.image;
        }else{
          grpImg = './assets/img/default.jpeg';
        }
        res.image_url=grpImg;
        this.groupDetails= res;
        //console.log(res);
        this.loading.dismissAll()
    },err=>{
      this.loading.dismissAll()
    })
  }
  
  sendMsg(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
    });
    this.loading.present();
    //console.log(this.message.trim());
    let inputMsg = this.message;
    let parentId = 0;
    if(inputMsg!=''){
        let userDataMsg = {message: inputMsg, is_delete: false, type: 1, customerId: this.userData.id, is_parent: parentId, typepid:this.groupId};
        this.dataService.postData(userDataMsg,'comments').then((res:any)=>{
            this.message = '';
            this.getAllComment();
            this.loading.dismissAll()
        },err=>{
          this.loading.dismissAll()
        })
    }else{
      this.loading.dismissAll();
    }
    
  }

  getGroupTagList(){
    let filterData = '{"where":{"group_id":'+this.groupId+'}, "include":["interest"], "order" : "id desc"}';
    this.dataService.getData('GroupInterests?filter='+filterData).then((result:any) => {
      this.groupTag = result;
      //console.log(result);
    }, (err) => {
      
    }); 
    
  }
  
  getAllComment(){
    let filterData = '{"where":{"typepid":'+this.groupId+'}, "include":["customer"], "order" : "id desc"}';
    this.dataService.getData('comments?filter='+filterData).then((result:any) => {
      this.allCommentList=result;
      //console.log(result);
      
    }, (err) => {
      
    }); 
  }
  
  likeComment(data, indexdata){
    let userDataMsg = {customerId: this.userData.id, commentId: data.id};
    this.dataService.postData(userDataMsg,'comment_likes').then((res:any)=>{
      this.allCommentList[indexdata].is_like = true;
    },err=>{
      
    })
  }

  unlikeComment(data, indexdata){
    let userDataMsg = {customerId: this.userData.id, commentId: data.id};
    this.dataService.postData(userDataMsg,'comment_likes/deleteAllData').then((res:any)=>{
      this.allCommentList[indexdata].is_like = false;
    },err=>{
      
    })
  }
}
