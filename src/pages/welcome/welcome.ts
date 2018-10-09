import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { AuthServiceProvider, ResponseMessage } from '../../providers';
/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  public userData:any;
  public isUserLogin:string=localStorage.getItem("isUserLogedin");
  public loguser:any;
  constructor(public navCtrl: NavController,
    public userService: AuthServiceProvider,
    private myApp:MyApp) { 
      const loguserDet = JSON.parse(localStorage.getItem('userPrfDet'));
      this.userData=loguserDet;
    }

  login() {
    this.navCtrl.push('LoginPage');
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

  ionViewDidLoad() {
    //this.loguser = JSON.parse(localStorage.getItem('userData'));
    this.myApp.menuOpened();
  }

  public home() {
    //this.navCtrl.push('WelcomePage');
    this.navCtrl.setRoot('WelcomePage');
  }
  
  public grouplist() {
    this.navCtrl.setRoot('GrouplistPage');
  }

  public userLogout() {
    this.userService.patchData({is_login:false},'Customers/'+this.userData.id).then((result1:any) => {
    }, (err) => {
      
    });

    localStorage.clear();
    localStorage.removeItem("isUserLogedin");
    localStorage.removeItem("userData");
    localStorage.removeItem("userPrfDet");
    this.navCtrl.push('LoginPage');
  }
}
