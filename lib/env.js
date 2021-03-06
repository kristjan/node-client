// Generated by IcedCoffeeScript 1.7.1-c
(function() {
  var Env, FN, RunMode, SRV, Strictness, V1, V2, constants, fs, iced, join, kbpath, make_email, make_full_username, __iced_k, __iced_k_noop, _env, _ref;

  iced = require('iced-runtime').iced;
  __iced_k = __iced_k_noop = function() {};

  kbpath = require('keybase-path');

  join = require('path').join;

  constants = require('./constants').constants;

  _ref = require('./util'), make_full_username = _ref.make_full_username, make_email = _ref.make_email;

  FN = constants.filenames;

  SRV = constants.server;

  fs = require('fs');

  RunMode = (function() {
    RunMode.prototype.DEVEL = 0;

    RunMode.prototype.PROD = 1;

    function RunMode(s) {
      var m, t, _ref1;
      t = {
        devel: this.DEVEL,
        prod: this.PROD
      };
      _ref1 = (s != null) && ((m = t[s]) != null) ? [m, s, true] : [this.PROD, "prod", false], this._v = _ref1[0], this._name = _ref1[1], this._chosen = _ref1[2];
    }

    RunMode.prototype.is_devel = function() {
      return this._v === this.DEVEL;
    };

    RunMode.prototype.is_prod = function() {
      return this._v === this.PROD;
    };

    RunMode.prototype.toString = function() {
      return this._name;
    };

    RunMode.prototype.chosen = function() {
      return this._chosen;
    };

    RunMode.prototype.config_dir = function() {
      return this._name;
    };

    return RunMode;

  })();

  Strictness = (function() {
    Strictness.prototype.NONE = 0;

    Strictness.prototype.SOFT = 1;

    Strictness.prototype.STRICT = 2;

    function Strictness(s, def) {
      var m, t, _chosen, _ref1;
      if (def == null) {
        def = "soft";
      }
      t = {
        none: this.NONE,
        soft: this.SOFT,
        strict: this.STRICT
      };
      _ref1 = (s != null) && ((m = t[s]) != null) ? [m, s, true] : [t[def], def, false], this._v = _ref1[0], this._name = _ref1[1], _chosen = _ref1[2];
    }

    Strictness.prototype.is_soft = function() {
      return this._v === this.SOFT;
    };

    Strictness.prototype.is_none = function() {
      return this._v === this.NONE;
    };

    Strictness.prototype.is_strict = function() {
      return this._v === this.STRICT;
    };

    Strictness.prototype.toString = function() {
      return this._name;
    };

    Strictness.prototype.chosen = function() {
      return this._chosen;
    };

    return Strictness;

  })();

  V1 = 1;

  V2 = 2;

  Env = (function() {
    function Env() {
      this.env = process.env;
      this.argv = null;
      this.config = null;
      this.session = null;
      this._gpg_cmd = null;
      this.kbpath = kbpath.new_eng({
        hooks: {
          get_home: (function(_this) {
            return function(opts) {
              return _this._get_home(opts);
            };
          })(this)
        },
        name: "keybase"
      });
    }

    Env.prototype.set_config = function(c) {
      return this.config = c;
    };

    Env.prototype.set_session = function(s) {
      return this.session = s;
    };

    Env.prototype.set_argv = function(a) {
      return this.argv = a;
    };

    Env.prototype.get_opt = function(_arg) {
      var arg, co, config, dflt, env, _ref1;
      env = _arg.env, arg = _arg.arg, config = _arg.config, dflt = _arg.dflt;
      co = (_ref1 = this.config) != null ? _ref1.obj() : void 0;
      return (typeof env === "function" ? env(this.env) : void 0) || (typeof arg === "function" ? arg(this.argv) : void 0) || ((co != null) && (typeof config === "function" ? config(co) : void 0)) || (typeof dflt === "function" ? dflt() : void 0) || null;
    };

    Env.prototype.get_config_dir = function(version) {
      if (version == null) {
        version = V2;
      }
      if (version === V1) {
        return this.kbpath.config_dir_v1();
      } else {
        return this.kbpath.config_dir();
      }
    };

    Env.prototype.get_data_dir = function() {
      return this.kbpath.data_dir();
    };

    Env.prototype.get_cache_dir = function() {
      return this.kbpath.cache_dir();
    };

    Env.prototype.maybe_fallback_to_layout_v1 = function(cb) {
      var err, old_config, res, stat, ___iced_passed_deferral, __iced_deferrals, __iced_k;
      __iced_k = __iced_k_noop;
      ___iced_passed_deferral = iced.findDeferral(arguments);
      err = null;
      res = false;
      (function(_this) {
        return (function(__iced_k) {
          if (!(_this.env.XDG_CONFIG_HOME || _this.env.XDG_CACHE_HOME || _this.env.XDG_DATA_HOME)) {
            old_config = _this.get_config_filename(V1);
            (function(__iced_k) {
              __iced_deferrals = new iced.Deferrals(__iced_k, {
                parent: ___iced_passed_deferral,
                filename: "/Users/max/src/keybase/node-client/src/env.iced",
                funcname: "Env.maybe_fallback_to_layout_v1"
              });
              fs.stat(old_config, __iced_deferrals.defer({
                assign_fn: (function() {
                  return function() {
                    err = arguments[0];
                    return stat = arguments[1];
                  };
                })(),
                lineno: 95
              }));
              __iced_deferrals._fulfill();
            })(function() {
              return __iced_k((err == null) && (typeof stat !== "undefined" && stat !== null ? stat.isFile() : void 0) ? (_this.kbpath = _this.kbpath.fallback_to_v1(), res = true) : err.code === 'ENOENT' ? err = null : void 0);
            });
          } else {
            return __iced_k();
          }
        });
      })(this)((function(_this) {
        return function() {
          return cb(err, res);
        };
      })(this));
    };

    Env.prototype.get_port = function() {
      return this.get_opt({
        env: function(e) {
          return e.KEYBASE_PORT;
        },
        arg: function(a) {
          return a.port;
        },
        config: function(c) {
          var _ref1;
          return (_ref1 = c.server) != null ? _ref1.port : void 0;
        },
        dflt: function() {
          return SRV.port;
        }
      });
    };

    Env.prototype.get_config_filename = function(version) {
      if (version == null) {
        version = V2;
      }
      return this.get_opt({
        env: function(e) {
          return e.KEYBASE_CONFIG_FILE;
        },
        arg: function(a) {
          return a.config;
        },
        dflt: (function(_this) {
          return function() {
            return join(_this.get_config_dir(version), FN.config_file);
          };
        })(this)
      });
    };

    Env.prototype.get_session_filename = function() {
      return this.get_opt({
        env: function(e) {
          return e.KEYBASE_SESSION_FILE;
        },
        arg: function(a) {
          return a.session_file;
        },
        config: function(c) {
          var _ref1;
          return c != null ? (_ref1 = c.files) != null ? _ref1.session : void 0 : void 0;
        },
        dflt: (function(_this) {
          return function() {
            return join(_this.get_cache_dir(), FN.session_file);
          };
        })(this)
      });
    };

    Env.prototype.get_db_filename = function() {
      return this.get_opt({
        env: function(e) {
          return e.KEYBASE_DB_FILE;
        },
        arg: function(a) {
          return a.db_file;
        },
        config: function(c) {
          var _ref1;
          return c != null ? (_ref1 = c.files) != null ? _ref1.db : void 0 : void 0;
        },
        dflt: (function(_this) {
          return function() {
            return join(_this.get_data_dir(), FN.db_file);
          };
        })(this)
      });
    };

    Env.prototype.get_nedb_filename = function() {
      return this.get_opt({
        config: function(c) {
          var _ref1;
          return c != null ? (_ref1 = c.files) != null ? _ref1.nedb : void 0 : void 0;
        },
        dflt: (function(_this) {
          return function() {
            return join(_this.get_home(), FN.config_dir, FN.nedb_file);
          };
        })(this)
      });
    };

    Env.prototype.get_tmp_keyring_dir = function() {
      return this.get_opt({
        env: function(e) {
          return e.KEYBASE_TMP_KEYRING_DIR;
        },
        arg: function(a) {
          return a.tmp_keyring_dir;
        },
        config: function(c) {
          var _ref1;
          return c != null ? (_ref1 = c.files) != null ? _ref1.tmp_keyring_dir : void 0 : void 0;
        },
        dflt: (function(_this) {
          return function() {
            return join(_this.get_cache_dir(), FN.tmp_keyring_dir);
          };
        })(this)
      });
    };

    Env.prototype.get_preserve_tmp_keyring = function() {
      return this.get_opt({
        env: function(e) {
          return e.KEYBASE_PRESERVE_TMP_KEYRING;
        },
        arg: function(a) {
          return a.preserve_tmp_keyring;
        },
        dflt: function() {
          return false;
        }
      });
    };

    Env.prototype.get_host = function() {
      return this.get_opt({
        env: function(e) {
          return e.KEYBASE_HOST;
        },
        arg: function(a) {
          return a.host;
        },
        config: function(c) {
          var _ref1;
          return (_ref1 = c.server) != null ? _ref1.host : void 0;
        },
        dflt: function() {
          return SRV.host;
        }
      });
    };

    Env.prototype.get_debug = function() {
      return this.get_opt({
        env: function(e) {
          return e.KEYBASE_DEBUG;
        },
        arg: function(a) {
          return a.debug;
        },
        config: function(c) {
          var _ref1;
          return (_ref1 = c.run) != null ? _ref1.d : void 0;
        },
        dflt: function() {
          return false;
        }
      });
    };

    Env.prototype.get_no_tls = function() {
      return this.get_opt({
        env: function(e) {
          return e.KEYBASE_NO_TLS;
        },
        arg: function(a) {
          return a.no_tls;
        },
        config: function(c) {
          var _ref1;
          return (_ref1 = c.server) != null ? _ref1.no_tls : void 0;
        },
        dflt: function() {
          return SRV.no_tls;
        }
      });
    };

    Env.prototype.get_api_uri_prefix = function() {
      return this.get_opt({
        env: function(e) {
          return e.KEYBASE_API_URI_PREFIX;
        },
        arg: function(a) {
          return a.api_uri_prefix;
        },
        config: function(c) {
          var _ref1;
          return (_ref1 = c.server) != null ? _ref1.api_uri_prefix : void 0;
        },
        dflt: function() {
          return SRV.api_uri_prefix;
        }
      });
    };

    Env.prototype.get_run_mode = function() {
      var raw;
      if (!this._run_mode) {
        raw = this.get_opt({
          env: function(e) {
            return e.KEYBASE_RUN_MODE;
          },
          arg: function(a) {
            return a.m;
          },
          config: function(c) {
            var _ref1;
            return (_ref1 = c.run) != null ? _ref1.mode : void 0;
          },
          dflt: null
        });
        this._run_mode = new RunMode(raw);
      }
      return this._run_mode;
    };

    Env.prototype.get_log_level = function() {
      return this.get_opt({
        env: function(e) {
          return e.KEYBASE_LOG_LEVEL;
        },
        arg: function(a) {
          return a.l;
        },
        config: function(c) {
          var _ref1;
          return (_ref1 = c.run) != null ? _ref1.log_level : void 0;
        },
        dflt: function() {
          return null;
        }
      });
    };

    Env.prototype.get_passphrase = function() {
      return this.get_opt({
        env: function(e) {
          return e.KEYBASE_PASSPHRASE;
        },
        arg: function(a) {
          return a.passphrase;
        },
        config: function(c) {
          var _ref1;
          return (_ref1 = c.user) != null ? _ref1.passphrase : void 0;
        },
        dflt: function() {
          return null;
        }
      });
    };

    Env.prototype.get_username = function() {
      return this.get_opt({
        env: function(e) {
          return e.KEYBASE_USERNAME;
        },
        arg: function(a) {
          return a.username;
        },
        config: function(c) {
          var _ref1;
          return (_ref1 = c.user) != null ? _ref1.name : void 0;
        },
        dflt: function() {
          return null;
        }
      });
    };

    Env.prototype.is_me = function(u2) {
      return (u2 != null) && (u2.toLowerCase() === this.get_username().toLowerCase());
    };

    Env.prototype.get_uid = function() {
      return this.get_opt({
        env: function(e) {
          return e.KEYBASE_UID;
        },
        arg: function(a) {
          return a.uid;
        },
        config: function(c) {
          var _ref1;
          return (_ref1 = c.user) != null ? _ref1.id : void 0;
        },
        dflt: function() {
          return null;
        }
      });
    };

    Env.prototype.get_email = function() {
      return this.get_opt({
        env: function(e) {
          return e.KEYBASE_EMAIL;
        },
        arg: function(a) {
          return a.email;
        },
        config: function(c) {
          var _ref1;
          return (_ref1 = c.user) != null ? _ref1.email : void 0;
        },
        dflt: function() {
          return null;
        }
      });
    };

    Env.prototype._get_home = function(_arg) {
      var null_ok;
      null_ok = _arg.null_ok;
      return this.get_opt({
        env: function(e) {
          return e.KEYBASE_HOME_DIR;
        },
        arg: function(a) {
          return a.homedir;
        },
        dflt: function() {
          return null;
        }
      });
    };

    Env.prototype.get_home = function(opts) {
      return this.kbpath.home(opts);
    };

    Env.prototype.get_home_gnupg_dir = function(null_ok) {
      var ret;
      if (null_ok == null) {
        null_ok = false;
      }
      ret = this.get_home({
        null_ok: true
      });
      if (ret != null) {
        ret = join(ret, ".gnupg");
      }
      return ret;
    };

    Env.prototype.get_gpg_cmd = function() {
      return this._gpg_cmd || this.get_opt({
        env: function(e) {
          return e.KEYBASE_GPG;
        },
        arg: function(a) {
          return a.gpg;
        },
        config: function(c) {
          return c.gpg;
        },
        dflt: function() {
          return null;
        }
      });
    };

    Env.prototype.set_gpg_cmd = function(c) {
      return this._gpg_cmd = c;
    };

    Env.prototype.get_proxy = function() {
      return this.get_opt({
        env: function(e) {
          return e.http_proxy || e.https_proxy;
        },
        arg: function(a) {
          return a.proxy;
        },
        config: function(c) {
          var _ref1;
          return (_ref1 = c.proxy) != null ? _ref1.url : void 0;
        },
        dflt: function() {
          return null;
        }
      });
    };

    Env.prototype.get_tor = function() {
      return this.get_opt({
        env: function(e) {
          return e.TOR_ENABLED;
        },
        arg: function(a) {
          return a.tor;
        },
        config: function(c) {
          var _ref1;
          return (_ref1 = c.tor) != null ? _ref1.enabled : void 0;
        },
        dflt: function() {
          return false;
        }
      });
    };

    Env.prototype.get_tor_strict = function() {
      return this.get_opt({
        env: function(e) {
          return e.TOR_STRICT;
        },
        arg: function(a) {
          return a.tor_strict;
        },
        config: function(c) {
          var _ref1;
          return (_ref1 = c.tor) != null ? _ref1.strict : void 0;
        },
        dflt: function() {
          return false;
        }
      });
    };

    Env.prototype.get_tor_leaky = function() {
      return this.get_opt({
        env: function(e) {
          return e.TOR_LEAKY;
        },
        arg: function(a) {
          return a.tor_leaky;
        },
        config: function(c) {
          var _ref1;
          return (_ref1 = c.tor) != null ? _ref1.leaky : void 0;
        },
        dflt: function() {
          return false;
        }
      });
    };

    Env.prototype.get_tor_proxy = function(null_ok) {
      return this.host_split(this.get_opt({
        env: function(e) {
          return e.TOR_PROXY;
        },
        arg: function(a) {
          return a.tor_proxy;
        },
        config: function(c) {
          var _ref1;
          return (_ref1 = c.tor) != null ? _ref1.proxy : void 0;
        },
        dflt: function() {
          if (null_ok) {
            return null;
          } else {
            return constants.tor.default_proxy;
          }
        }
      }));
    };

    Env.prototype.host_split = function(s) {
      var hostname, parts, port, ret;
      ret = s == null ? s : (parts = s.split(/:/), hostname = parts[0], port = parts.length > 1 ? parts[1] : null, {
        hostname: hostname,
        port: port
      });
      return ret;
    };

    Env.prototype.get_tor_hidden_address = function(null_ok) {
      return this.host_split(this.get_opt({
        env: function(e) {
          return e.TOR_HIDDEN_ADDRESS;
        },
        arg: function(a) {
          return a.tor_hidden_address;
        },
        config: function(c) {
          var _ref1;
          return (_ref1 = c.tor) != null ? _ref1.hidden_address : void 0;
        },
        dflt: function() {
          if (null_ok) {
            return null;
          } else {
            return constants.tor.hidden_address;
          }
        }
      }));
    };

    Env.prototype.get_proxy_ca_certs = function() {
      return this.get_opt({
        env: function(e) {
          return e.KEYBASE_PROXY_CA_CERTS;
        },
        arg: function(a) {
          return a.proxy_ca_certs;
        },
        config: function(c) {
          var _ref1;
          return (_ref1 = c.proxy) != null ? _ref1.ca_certs : void 0;
        },
        dflt: function() {
          return null;
        }
      });
    };

    Env.prototype.get_loopback_port_range = function() {
      var parse_range;
      parse_range = function(s) {
        var i, m, _i, _len, _ref1, _results;
        if (s == null) {
          return null;
        } else if (!(m = s.match(/^(\d+)-(\d+)$/))) {
          _ref1 = m.slice(1);
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            i = _ref1[_i];
            _results.push(parseInt(i, 10));
          }
          return _results;
        } else {
          return null;
        }
      };
      return this.get_opt({
        env: function(e) {
          return parse_range(e.KEYBASE_LOOPBACK_PORT_RANGE);
        },
        arg: function(a) {
          return parse_range(a.loopback_port_range);
        },
        config: function(c) {
          return c.loopback_port_range;
        },
        dflt: function() {
          return constants.loopback_port_range;
        }
      });
    };

    Env.prototype.get_no_gpg_options = function() {
      return this.get_opt({
        env: function(e) {
          return e.KEYBASE_NO_GPG_OPTIONS;
        },
        arg: function(a) {
          return a.no_gpg_options;
        },
        config: function(c) {
          return c.no_gpg_options;
        },
        dflt: function() {
          return false;
        }
      });
    };

    Env.prototype.get_merkle_checks = function() {
      var raw;
      if (!this._merkle_mode) {
        raw = this.get_opt({
          env: function(e) {
            return e.KEYBASE_MERKLE_CHECKS;
          },
          arg: function(a) {
            return a.merkle_checks;
          },
          config: function(c) {
            return c.merkle_checks;
          },
          dflt: function() {
            return false;
          }
        });
        this._merkle_mode = new Strictness(raw, (this.is_test() ? 'strict' : 'soft'));
      }
      return this._merkle_mode;
    };

    Env.prototype.get_merkle_key_fingerprints = function() {
      var split;
      split = function(x) {
        if (x != null) {
          return x.split(/:,/);
        } else {
          return null;
        }
      };
      return this.get_opt({
        env: function(e) {
          return split(e.KEYBASE_MERKLE_KEY_FINGERPRINTS);
        },
        arg: function(a) {
          return split(a.merkle_key_fingerprint);
        },
        config: function(c) {
          var _ref1;
          return c != null ? (_ref1 = c.keys) != null ? _ref1.merkle : void 0 : void 0;
        },
        dflt: (function(_this) {
          return function() {
            if (_this.is_test()) {
              return constants.testing_keys.merkle;
            } else {
              return constants.keys.merkle;
            }
          };
        })(this)
      });
    };

    Env.prototype.get_no_color = function() {
      return this.get_opt({
        env: function(e) {
          return e.KEYBASE_NO_COLOR;
        },
        arg: function(a) {
          return a.no_color;
        },
        config: function(c) {
          return c.no_color;
        },
        dflt: function() {
          return false;
        }
      });
    };

    Env.prototype.get_args = function() {
      return this.argv._;
    };

    Env.prototype.get_argv = function() {
      return this.argv;
    };

    Env.prototype.is_configured = function() {
      return this.get_username() != null;
    };

    Env.prototype.is_test = function() {
      var _ref1;
      return (this.get_run_mode().is_devel()) || ((_ref1 = this.get_host()) === 'localhost' || _ref1 === '127.0.0.1');
    };

    Env.prototype.keybase_email = function() {
      return make_email(this.get_username());
    };

    Env.prototype.keybase_full_username = function() {
      return make_full_username(this.get_username());
    };

    Env.prototype.init_home_scheme = function(cb) {};

    Env.prototype.make_pgp_uid = function() {
      return {
        username: this.keybase_full_username(),
        email: this.keybase_email()
      };
    };

    return Env;

  })();

  _env = null;

  exports.init_env = function(a) {
    return _env = new Env;
  };

  exports.env = function() {
    return _env;
  };

}).call(this);
