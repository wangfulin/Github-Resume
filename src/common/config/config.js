'use strict';
/**
 * config
 */
export default {
  //key: value
  pathname_prefix: "", 
  pathname_suffix: ".html",

  view: {
    content_type: 'text/html',
    file_ext: '.html',
    file_depr: '_',
    root_path: think.ROOT_PATH + '/view',
    theme: '',
    type: 'ejs'
  }
};