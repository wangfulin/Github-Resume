'use strict';
import Github from 'github-api'
import request from 'request'
import events from 'events'

export default class extends think.controller.base {

	createGithub(){
      if(!this.assign('github')){
         this.assign({
            github: new Github({
               username: this.assign('username'),
               password: this.assign('password'),
               auth: 'basic'
             })
         });
      }
	}

   // 获取某个用户某个仓库提交的commits个数
   async getRepoCommitsCount(username){
      let _self = this;
      let EventEmitter = events.EventEmitter;

      let body = new EventEmitter();

      // let commitsCountPromise = new Promise(function(){
      //    this.http.success(function(){
      //       resolve()
      //    });
      // });
      // console.log(think.http.url);
      // console.log(think.http.startTime);
      let popularRepos = this.assign('popularRepos');
      let i = 0;
      let commitsCountArr = [];

      let commitsCountPromise = new Promise(
         function(resolve, reject){
            popularRepos.forEach(function(repo){
               request({
                  'uri': 'https://api.github.com/repos/' + username + '/' + repo.name + '/commits',
                  'method': 'get',
                  'headers': {
                   'User-Agent': 'request'
                  }
               }, function(err, res, commits){
                  if(err){
                     reject();
                  }
                  commitsCountArr.push(JSON.parse(commits).length);
                  i++;
                  if(i === 3){
                     _self.assign('commitsCountArr', commitsCountArr);
                     resolve();
                  }
               });
            });
         });

      return commitsCountPromise;
   }

   // 获取用户最 popular 的repositories
   // star 的权重是 1，watcher 的权重是 1.2，fork 的权重是 1.4
   async getPopularRepositories(username, max){
      var _self = this;
      return this.getUserRepos(username).then(function(repos){
         repos.sort(function(prev, next){
            let prev_stargazers_count = prev.stargazers_count;
            let prev_watchers_count = prev.watchers_count;
            let prev_forks_count = prev.forks_count;

            let next_stargazers_count = next.stargazers_count;
            let next_watchers_count = next.watchers_count;
            let next_forks_count = next.forks_count;

            var prev_count = prev_stargazers_count * 1.0 + prev_watchers_count * 1.2 + prev_forks_count * 1.4;
            var next_count = next_stargazers_count * 1.0 + next_watchers_count * 1.2 + next.forks_count * 1.4;

            return next_count - prev_count;
         });
         var res = [];
         if(repos.length > max){
            for(let i=0; i<max; i++){
               res[i] = repos[i];
            }
            _self.assign('popularRepos', res);
         }else{
            _self.assign('popularRepos', repos);
         }
      },function(err){
         console.log(err);
      });
   }

   // 关注
   follow(username){

   }

   // 取消关注
   unfollow(username){

   }

   // 获取用户的所有仓库信息
   async getUserRepos(username){
      this.createGithub();
      let github = this.assign('github');
      let user = github.getUser();

      let reposPromise = new Promise(function(resolve, reject){
         user.userRepos(username, function(err, repos){
            if(err){
               reject(err);
            }else{
               resolve(repos);
            }
         });
      });
      return reposPromise;
   }

   // 获取仓库信息
   async getRepoInfo(username, reponame){
         this.createGithub();
   		let github = this.assign('github');
   		let repo = github.getRepo(username, reponame);

   		let repoPromise = new Promise(function(resolve, reject){
   			repo.show(function(err, repository){
   				if(err){
   					reject(err);
   				}else{
   					resolve(repository);
   				}
   			});
   		});
   		return repoPromise;
   	}

   // 获取用户信息
   async getUserInfo(username){
         this.createGithub();
   	   let github = this.assign('github');
   		let user = github.getUser();

   		let userPromise = new Promise(function(resolve, reject){
   			user.show(username, function(err, user){
   				if(err){
   					reject(err);
   				}else{
   					resolve(user);
   				}
   			})
   		});
   		return userPromise;
   }

   // 根据参数搜索github
   async searchGithub(opts){
   	let github = this.assign('github');
   	let search;
   	let type = opts.type || 'repositories';
   	console.log(type);
   	let sort = opts.sort ? opts.sort : null;
   	let order = opts.order ? opts.order : null;
   	let searchPromise ;
   	if(type === 'code'){
         let language = opts.language ? opts.language : null;
         let _in = opts._in ? opts._in : null;
         let repo = opts.repo ? opts.repo : null;
         let query = opts.query + 
            (language ? ('+language:' + language) : '') +
            (_in ? ('+in:' + _in) : '') +
            (repo ? ('+repo:' + repo) : '') +
            (sort ? ('&sort=' + sort) : '') +
            (order ? ('&order=' + order) : '');
         search = github.getSearch(query);
   		searchPromise = new Promise(function(resolve, reject){
   			search.code(null, function(err, codes){
   				if(err){
   					reject(err);
   				}else{
   					resolve(codes);
   				}
   			});
   		});
   	}else if(type === 'issues'){
         let language = opts.language ? opts.language : null;
         let label = opts.label ? opts.label : null;
         let state = opts.state ? opts.state : null;
         let query = opts.query + 
            (language ? ('+language:' + language) : '') +
            (label ? ('+label:' + label) : '') +
            (state ? ('+state:' + state) : '') +
            (sort ? ('&sort=' + sort) : '') +
            (order ? ('&order=' + order) : '');
         search = github.getSearch(query);
   		searchPromise = new Promise(function(resolve, reject){
   			search.issues(null, function(err, issues){
   				if(err){
   					reject(err);
   				}else{
   					resolve(issues);
   				}
   			});
   		});
   	}else if(type === 'users'){
         let repos = opts.repos ? opts.repos : null;
         let followers = opts.followers ? opts.followers : null;
         let query = opts.query + 
            (repos ? ('+repos:' + repos) : '') +
            (followers ? ('+followers:' + followers) : '') +
            (sort ? ('&sort=' + sort) : '') +
            (order ? ('&order=' + order) : '');
         search = github.getSearch(query);
   		searchPromise = new Promise(function(resolve, reject){
   			search.users(null, function(err, users){
   				if(err){
   					reject(err);
   				}else{
   					resolve(users);
   				}
   			});
   		});
   	}else{
   		let language = opts.language ? opts.language : null;
   		let query = opts.query + 
   			(language ? ('+language:' + language) : '') +
   			(sort ? ('&sort=' + sort) : '') +
   			(order ? ('&order=' + order) : '');
   		search = github.getSearch(query);
   		searchPromise = new Promise(function(resolve, reject){
   			search.repositories(null, function(err, repositories){
   				if(err){
   					reject(err);
   				}else{
   					resolve(repositories);
   				}
   			});
   		});
   	}
		return searchPromise;
   }
}