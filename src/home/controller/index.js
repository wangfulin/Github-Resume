'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(){
    return this.display();
  }

  async resumeAction(){
    let _self = this;
    let username = this.post('username');
    let password = this.post('password');
    let theme = this.post('theme')

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