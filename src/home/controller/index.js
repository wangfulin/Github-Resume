'use strict';

import Base from './base.js';
import Pageres from 'pageres';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(){
    return this.display();
  }

  downloadAction(){
    let dest = think.ROOT_PATH + '/www/static/img/screenshot';
    let username = this.get('username');
    let theme = this.get('theme');
    let pageres = new Pageres({delay: 2, filename: username + '-' + theme})
    .src('http://127.0.0.1:8360/home/index/resume/username/' + username + '/theme/' + theme, ['1024x1200'])
    .dest(dest)
    .run()
    .then(() => console.log('done'));;
  }

  // to be updated
  async liuchangAction(){
    let _self = this;
    let username = this.post('username') || this.get('username');
    let password = this.post('password');
    let theme = this.post('theme') || this.get('theme');
    this.assign('username', username);
    this.assign('password', password);
    this.assign('theme', theme);

    await this.getUserInfo(username).then(function(user){
      _self.assign('user', {
        name: user.name,
        company: user.company,
        email: user.email,
        blog: user.blog,
        followers: user.followers,
        following: user.following,
        joinTime: user.created_at,
        avatarPic: user.avatar_url
      });
    }, function(err){
      console.log('fail');
    });
    //await this.getUserOrganizations();

    await this.getPopularRepositories(username, 3);

    await this.getRepoCommitsCount(username);

    return this.display();
  }

  async resumeAction(){
    let _self = this;
    let username = this.post('username') || this.get('username');
    let password = this.post('password');
    let theme = this.post('theme') || this.get('theme');
    this.assign('username', username);
    this.assign('password', password);
    this.assign('theme', theme);

    await this.getUserInfo(username).then(function(user){
      _self.assign('user', {
        name: user.name,
        company: user.company,
        email: user.email,
        blog: user.blog,
        followers: user.followers,
        following: user.following,
        joinTime: user.created_at,
        avatarPic: user.avatar_url
      });
    }, function(err){
      console.log('fail');
    });
    //await this.getUserOrganizations();

    await this.getPopularRepositories(username, 3);

    await this.getRepoCommitsCount(username);

    return this.display();
  }

  async repoAction(){
    let _self = this;

    await this.getRepoInfo('wangfulin', 'css').then(function(repo){
      
    },function(err){
      console.log('fail');
    });
  	return this.display();
  }

  async searchAction(){
    let _self = this;
    let opts ={
      type: 'code',
      query: 'addClass',
      _in : 'file',
      language: 'js',
      repo: 'jquery/jquery'
    };
    await this.searchGithub(opts).then(function(res){
      _self.assign('res', res);
      for(let i in res){
        console.log(i);
      }
    },function(err){
      console.log(err);
    });
    return this.display();
  }
}