<?php

class UiPlugin {
  // override the login behavior
	function __construct() {
    if ($_POST["auth"]) {
      $_POST["auth"]["server"] = getenv('POSTGRES_HOST');
      $_POST["auth"]["driver"] = 'pgsql';
      $_POST["auth"]["username"] = getenv('POSTGRES_USER');
      $_POST["auth"]["password"] = getenv('POSTGRES_PASSWORD');
      $_POST["auth"]["db"] = getenv('POSTGRES_DB');
    }
	}

	function credentials() {
	   return array(getenv('POSTGRES_HOST'), $_GET["username"], get_password());
   }

  function login($login, $password) {
    return true;
	}

	function loginFormField($name, $heading, $value) {
    if($name === 'username' || $name === 'password' || $name === 'db') {
      return '';
    }
	}

  function head() {
    echo '<style>input[type="number"].size { width: 100px; }</style>';
    echo '<style>legend { width: 100%; }</style>';
    echo '<style>a:visited { color: #2e84e4 !important; }</style>';
  }

  // Select style to be used.
  function css() {
		return ['designs/pepa-linha/adminer.css'];
	}
}

function adminer_object() {
  require_once('plugins/plugin.php');
  require_once('plugins/enum-types.php');
  require_once('plugins/frames.php');
  require_once('plugins/edit-foreign.php');
	return new \AdminerPlugin([
    new \UiPlugin(),
    new \AdminerEnumTypes(),
    new \AdminerFrames(),
    new \AdminerEditForeign()
  ]);
}

require('adminer.php');
