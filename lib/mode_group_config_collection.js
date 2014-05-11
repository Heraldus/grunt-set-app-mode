/*
 * grunt-set-app-mode
 * https://github.com/cfogelberg/grunt-set-app-mode
 *
 * Copyright (c) 2014 Christo Fogelberg
 * Licensed under the MIT license.
 */

var ModeGroupConfig = require("../lib/mode_group_config");

function ModeGroupConfigCollection (files_array, expected_modes) {
  this.configs = [];

  for(var i = 0; i < files_array.length; ++i) {
    this.configs.push(new ModeGroupConfig(files_array[i].orig, expected_modes));
  }
};

ModeGroupConfigCollection.prototype.length = function() {
  return this.configs.length;
};

ModeGroupConfigCollection.prototype.get = function(index) {
  return this.configs[index];
};

module.exports = ModeGroupConfigCollection;