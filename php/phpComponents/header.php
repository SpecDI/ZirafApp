<header class="header" id="header">
  <div class="row">
    
    <div class="col-2">
      <!-- link to settings -->
      <button class="float-left" id="settingsNav">
        <p><i class="fa fa-gear" aria-hidden="true"></i></p>
        <p class="navText">Settings</p>
      </button>
    </div>
    
    <div class="col-4 text-center">
      <!-- link to exec panel -->
      <!-- only displayed for members with appropriate clearance -->
      <?php
        //import the security file
        require_once "security.php";
        if(checkClearance()){
          echo '<button class="float-left" id="execPanelNav">
                  <p><i class="fa fa-key fa-rotate-90" aria-hidden="true"></i></p>
                  <p class="navText">Exec Panel</p>
                </button>';
        }
      ?>
    </div>

    <!-- logout button -->
    <div class="col-6">
      <button class="float-right" id="logoutNav">
        <p><i class="fa fa-sign-out" aria-hidden="true"></i></p>
        <p class="navText">Log Out</p>
      </button>
    </div>
  

  </div>
</header>

<script src="https://code.jquery.com/jquery-3.2.1.min.js"
integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
<!-- The js script for this file -->
<script src="../js/header.js"></script>