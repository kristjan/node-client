{Base} = require './base'
log = require '../log'
{ArgumentParser} = require 'argparse'
{add_option_dict} = require './argparse'
{PackageJson} = require '../package'
{gpg} = require '../gpg'
{BufferOutStream} = require '../stream'
session = require '../session'
{make_esc} = require 'iced-error'
{prompt_for_int} = require '../prompter'
log = require '../log'
{key_select} = require '../keyselector'

##=======================================================================

exports.Command = class Command extends Base

  #----------

  use_session : () -> true

  #----------

  add_subcommand_parser : (scp) ->
    opts = 
      aliases  : []
      help : "push a PGP key from the client to the server"
    name = "push"
    sub = scp.addParser name, opts
    sub.addArgument [ "search" ], { nargs : '?' }
    return opts.aliases.concat [ name ]

  #----------

  run : (cb) ->
    esc = make_esc cb, "run"
    await key_select @argv.search, esc defer km
    await session.login esc defer()
    cb null

##=======================================================================

