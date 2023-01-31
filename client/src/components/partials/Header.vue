<script setup>
import { RouterLink, RouterView } from "vue-router";
import UserProviderVue from "../providers/UserProvider.vue";
</script>

<template>
	<UserProviderVue v-slot="{ logout, isAuth }">
		<section class="header">
			<div class="navbar-option">
				<nav class="navbar navbar-default">
					<div class="navbar-header">
						<button
							type="button"
							class="navbar-toggle"
							data-toggle="collapse"
							data-target="#myNavbar"
						>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
						</button>
					</div>
					<div class="navbar-collapse" id="myNavbar">
						<ul class="nav navbar-nav navbar-left">
							<li>
								<RouterLink
									to="/"
									class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
									>Accueil</RouterLink
								>
							</li>
							<li v-if="isAuth">
								<RouterLink
									to="/conversation"
									class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
									>Discussions</RouterLink
								>
							</li>
							<li v-if="isAuth">
								<RouterLink
									to="/chatbot"
									class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
									>Chatbot</RouterLink
								>
							</li>
							<li v-if="isAuth">
								<RouterLink
									to="/help"
									class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
									>Aide</RouterLink
								>
							</li>
							<li v-if="isAuth">
								<RouterLink
									to="/admin/dashboard"
									class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
									>Administrateur</RouterLink
								>
							</li>
							<li v-if="isAuth" @click="logout" class="pointer">
								<a
									class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
									>Déconnexion</a
								>
							</li>
							<li v-if="!isAuth">
								<RouterLink
									to="/register"
									class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
									>S'enregistrer</RouterLink
								>
							</li>
							<li v-if="!isAuth">
								<RouterLink
									to="/login"
									class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
									>Se connecter</RouterLink
								>
							</li>
						</ul>
					</div>
				</nav>
			</div>
			<section class="banner">
				<div class="banner-content">
					<div class="owl-carousel owl-theme">
						<div class="item">
							<h1>Be <span>Faster</span></h1>
							<p>Live Life to the Fullest</p>
						</div>
						<div class="item">
							<h1>Be <span>Faster</span></h1>
							<p>Live Life to the Fullest</p>
						</div>
						<div class="item">
							<h1>Be <span>Faster</span></h1>
							<p>Live Life to the Fullest</p>
						</div>
					</div>
				</div>
			</section>
		</section>
		<RouterView />
	</UserProviderVue>
</template>

<style>
.header {
	width: 100%;
	margin-bottom: 40px;
}

.pointer {
	cursor: pointer;
}

.header .navbar-toggle {
	border: 0;
	right: -210px;
	top: 2px;
}

.header .navbar-option,
.header .banner {
	margin: 0 215px;
}

.header .navbar-brand > img {
	margin-top: -10px;
}

.header .navbar-default .navbar-toggle .icon-bar {
	background-color: #f04c26;
}

.header .navbar-default .navbar-toggle:focus,
.header .navbar-default .navbar-toggle:hover {
	background-color: transparent;
}

.header {
	background-image: url("../../assets/images/banner.jpg");
	height: 645px;
	background-position: center;
	background-repeat: no-repeat;
}

.header .navbar-default {
	background-color: transparent;
	border: 0;
	padding-top: 15px;
	max-width: 900px;
}

.header .navbar-default .navbar-nav > li > a {
	color: white;
	font-size: 16px;
	font-weight: 500;
}

.header .navbar-default .navbar-nav > li > a:hover {
	color: #f04c26;
}

.header .banner {
	cursor: grab;
}

.header .banner .banner-content h1 {
	font-size: 90px;
	text-transform: uppercase;
	font-family: "Chelsea Market", cursive;
	margin-top: 170px;
	text-align: left;
	margin-left: 30px;
}

.header .banner .banner-content h1 span {
	color: #f04c26;
}

.header .banner .banner-content p {
	font-size: 34px;
	font-weight: 600;
	text-transform: uppercase;
	text-align: left;
	margin-left: 60px;
}

.header .banner .banner-content .owl-prev {
	position: absolute;
	left: -30px;
	top: 210px;
	background: url("../../assets/images/arrow-left.png") repeat !important;
	font-size: 0 !important;
	height: 28px;
	width: 17px;
	content: "";
}

.header .banner .banner-content .owl-next {
	background: url("../../assets/images/arrow-right.png") repeat !important;
	content: "";
	font-size: 0 !important;
	height: 28px;
	position: absolute;
	right: -30px;
	top: 210px;
	width: 17px;
}

@media (max-width: 767px) {
	.header .banner .banner-content .fa.fa-chevron-left {
		left: -10px;
	}

	.header .banner .banner-content .fa.fa-chevron-right {
		left: 10px;
	}

	.header .banner .banner-content h1 {
		font-size: 70px;
	}

	.header .banner .banner-content .owl-prev {
		left: -10px;
	}

	.header .banner .banner-content .owl-next {
		right: -10px;
	}
}
</style>
