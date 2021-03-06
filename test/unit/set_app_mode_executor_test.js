/*
 * grunt-set-app-mode
 * https://github.com/cfogelberg/grunt-set-app-mode
 *
 * Copyright (c) 2014 Christo Fogelberg
 * Licensed under the MIT license.
 */

// Allow indirectly-executed (should-executed) function literals to pass jshint IIFE warning:
/*jshint -W068 */
// Disable warning about initialising a variable (in this case UNDEFINED_FILES_ARRAY) to undefined
/*jshint -W080 */

"use strict";

describe("SetAppModeExecutor", function() {
  var should = require("should");
  var path = require("path");
  var grunt; // require before each test to ensure it is fresh
  var SetAppModeConfig = require("../../lib/set_app_mode_config");
  var ModeGroupConfigCollection = require("../../lib/mode_group_config_collection");
  var SetAppModeExecutor = require("../../lib/set_app_mode_executor");
  var Validators = require("../../test/lib/validators");


  var MODE_DEFAULT = "staging";
  var EXPECTED_MODES_DEFAULT = [ "dev", MODE_DEFAULT, "prod" ];
  var PREFIX_DEFAULT = "config";

  var MODE_METAL = "gold";
  var EXPECTED_MODES_METAL = [ "bronze", "silver", MODE_METAL ];
  var PREFIX_METAL_A = "mode";
  var PREFIX_METAL_B = "other";

  var MODE_TRAILING = "aaa";
  var EXPECTED_MODES_TRAILING = [ "aaa", "bbb", "ccc" ];
  var PREFIX_TRAILING = "trailing-mode.js";

  var DEST_DIR = "test/tmp";
  var SRC_DIR = "test/src";

  var CONFIG_DEFAULT = new SetAppModeConfig({
    expected_modes: EXPECTED_MODES_DEFAULT,
    mode: MODE_DEFAULT
  });

  var CONFIG_METAL = new SetAppModeConfig({
    expected_modes: EXPECTED_MODES_METAL,
    mode: MODE_METAL
  });

  var CONFIG_TRAILING = new SetAppModeConfig({
    expected_modes: EXPECTED_MODES_TRAILING,
    mode: MODE_TRAILING
  });

  var SRC_MODE_FILENAME_DEFAULT = PREFIX_DEFAULT + ".{{MODE}}.js";
  var SRC_MODE_GLOB_ARRAY_DEFAULT = [path.join(SRC_DIR, SRC_MODE_FILENAME_DEFAULT)];
  var FILES_ARRAY_DEFAULT = [{
    orig: {
      src: SRC_MODE_GLOB_ARRAY_DEFAULT,
      dest: DEST_DIR
    }
  }];
  var MODE_GROUP_CONFIG_COLLECTION_DEFAULT = new ModeGroupConfigCollection(FILES_ARRAY_DEFAULT,
    EXPECTED_MODES_DEFAULT);

  var SRC_MODE_FILENAME_METALS_A = PREFIX_METAL_A + ".{{MODE}}.js";
  var SRC_MODE_FILENAME_METALS_B = PREFIX_METAL_B + ".{{MODE}}.js";
  var SRC_MODE_GLOB_ARRAY_METALS_A = [path.join(SRC_DIR, SRC_MODE_FILENAME_METALS_A)];
  var SRC_MODE_GLOB_ARRAY_METALS_B = [path.join(SRC_DIR, SRC_MODE_FILENAME_METALS_B)];
  var FILES_ARRAY_METAL = [{
    orig: {
      src: SRC_MODE_GLOB_ARRAY_METALS_A,
      dest: DEST_DIR
    }
  }, {
    orig: {
      src: SRC_MODE_GLOB_ARRAY_METALS_B,
      dest: DEST_DIR
    }
  }];
  var MODE_GROUP_CONFIG_COLLECTION_METAL = new ModeGroupConfigCollection(FILES_ARRAY_METAL,
    EXPECTED_MODES_METAL);

  var SRC_MODE_FILENAME_TRAILING = PREFIX_TRAILING + ".{{MODE}}";
  var SRC_MODE_GLOB_ARRAY_TRAILING = [path.join(SRC_DIR, SRC_MODE_FILENAME_TRAILING)];
  var FILES_ARRAY_TRAILING = [{
    orig: {
      src: SRC_MODE_GLOB_ARRAY_TRAILING,
      dest: DEST_DIR
    }
  }];
  var MODE_GROUP_CONFIG_COLLECTION_TRAILING = new ModeGroupConfigCollection(FILES_ARRAY_TRAILING,
    EXPECTED_MODES_TRAILING);

  var EMPTY_FILES_ARRAY = [];

  var UNDEFINED_FILES_ARRAY = undefined;

  var NULL_FILES_ARRAY = null;



  beforeEach(function() {
    grunt = require("grunt");
    // Do the same as a grunt clean and grunt copy of src to build dir:
    if(grunt.file.exists(DEST_DIR)) {
      grunt.file.delete(DEST_DIR);
    }
    EXPECTED_MODES_DEFAULT.forEach(function(mode) {
      var src_filepath = SRC_MODE_GLOB_ARRAY_DEFAULT[0].replace("{{MODE}}", mode);
      var dest_filepath = path.join(DEST_DIR, SRC_MODE_FILENAME_DEFAULT.replace("{{MODE}}", mode));
      grunt.file.copy(src_filepath, dest_filepath);
    });
    EXPECTED_MODES_METAL.forEach(function(mode) {
      var src_filepath_a = SRC_MODE_GLOB_ARRAY_METALS_A[0].replace("{{MODE}}", mode);
      var dest_filepath_a = path.join(DEST_DIR, SRC_MODE_FILENAME_METALS_A.replace("{{MODE}}", mode));
      var src_filepath_b = SRC_MODE_GLOB_ARRAY_METALS_B[0].replace("{{MODE}}", mode);
      var dest_filepath_b = path.join(DEST_DIR, SRC_MODE_FILENAME_METALS_B.replace("{{MODE}}", mode));
      grunt.file.copy(src_filepath_a, dest_filepath_a);
      grunt.file.copy(src_filepath_b, dest_filepath_b);
    });
    EXPECTED_MODES_TRAILING.forEach(function(mode) {
      var src_filepath = SRC_MODE_GLOB_ARRAY_TRAILING[0].replace("{{MODE}}", mode);
      var dest_filepath = path.join(DEST_DIR, SRC_MODE_FILENAME_TRAILING.replace("{{MODE}}", mode));
      grunt.file.copy(src_filepath, dest_filepath);
    });
  });

  it("can apply a valid SetAppModeConfig and files array", function() {
    var exec = new SetAppModeExecutor({
      config: CONFIG_DEFAULT,
      mode_groups: MODE_GROUP_CONFIG_COLLECTION_DEFAULT
    });
    exec.apply_all();
    Validators.check_final_result(EXPECTED_MODES_DEFAULT, SRC_MODE_FILENAME_DEFAULT, MODE_DEFAULT, DEST_DIR, SRC_DIR);
  });

  it("can apply a valid SetAppModeConfig and multi-element files array", function() {
    var exec = new SetAppModeExecutor({
      config: CONFIG_METAL,
      mode_groups: MODE_GROUP_CONFIG_COLLECTION_METAL
    });
    exec.apply_all();
    Validators.check_final_result(EXPECTED_MODES_METAL, SRC_MODE_FILENAME_METALS_A, MODE_METAL, DEST_DIR,
      SRC_DIR);
    Validators.check_final_result(EXPECTED_MODES_METAL, SRC_MODE_FILENAME_METALS_B, MODE_METAL, DEST_DIR,
      SRC_DIR);
  });

  it("can apply a ModeGroupConfig with a trailing {{MODE}}", function() {
    var exec = new SetAppModeExecutor({
      config: CONFIG_TRAILING,
      mode_groups: MODE_GROUP_CONFIG_COLLECTION_TRAILING
    });
    exec.apply_all();
    Validators.check_final_result(EXPECTED_MODES_TRAILING, SRC_MODE_FILENAME_TRAILING, MODE_TRAILING, DEST_DIR,
      SRC_DIR);
  });

  it("throws error when configuration files array is undefined (falsy)", function() {
    (function() {
      var exec = new SetAppModeExecutor({
        config: CONFIG_DEFAULT,
        mode_groups: UNDEFINED_FILES_ARRAY
      });
    }).should.throw();
  });

  it("throws error when configuration files array is null (falsy)", function() {
    (function() {
      var exec = new SetAppModeExecutor({
        config: CONFIG_DEFAULT,
        mode_groups: NULL_FILES_ARRAY
      });
    }).should.throw();
  });
});
