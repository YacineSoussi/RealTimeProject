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
					<div class="navbar-collapse collapse" id="myNavbar">
						<ul class="nav navbar-nav navbar-left">
							<li>
								<RouterLink
									to="/"
									class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md font-medium"
									>Accueil</RouterLink
								>
							</li>
							<li v-if="isAuth">
								<RouterLink
									to="/conversation"
									class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md font-medium"
									>Discussions</RouterLink
								>
							</li>
							<li v-if="isAuth">
								<RouterLink
									to="/chatbot"
									class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md font-medium"
									>Chatbot</RouterLink
								>
							</li>
							<li v-if="isAuth">
								<RouterLink
									to="/help"
									class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md font-medium"
									>Aide</RouterLink
								>
							</li>
							<li v-if="isAuth">
								<RouterLink
									to="/admin/dashboard"
									class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md font-medium"
									>Administrateur</RouterLink
								>
							</li>
							<li v-if="isAuth" @click="logout" class="pointer">
								<a
									class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md font-medium"
									>Déconnexion</a
								>
							</li>
							<li v-if="!isAuth">
								<RouterLink
									to="/register"
									class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md font-medium"
									>S'enregistrer</RouterLink
								>
							</li>
							<li v-if="!isAuth">
								<RouterLink
									to="/login"
									class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md font-medium"
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
}

.collapse {
	visibility: visible !important;
}

.header .navbar-brand > img {
	margin-top: -10px;
}

.header .navbar-default .navbar-toggle .icon-bar {
	background-color: white;
}

@media (max-width: 767px) {
	.header .navbar-default {
		height: 319px;
	}
}

@media (max-width: 767px) {
	.header .navbar-default .navbar-collapse li a {
		padding-top: 5px;
		padding-bottom: 5px;
	}
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
	background-size: cover;
}

@media (max-width: 450px) {
	.header {
		background-position: initial;
	}
}

.header .navbar-default {
	background-color: transparent;
	border: 0;
	padding-top: 15px;
}

.header .navbar-default .navbar-nav > li > a {
	color: white;
	font-size: 16px;
	font-weight: 500;
}

.header .banner-content .owl-carousel {
	height: 100%;
}

.header .navbar-default .navbar-nav > li > a:hover {
	color: #f04c26;
}

.header .banner {
	cursor: grab;
	height: calc(100% - 85px);
}

@media (max-width: 767px) {
	.header .banner {
		height: calc(100% - 340px);
	}
}

.header .banner .banner-content {
	height: 100%;
}

.header .banner .banner-content h1 {
	font-size: 90px;
	text-transform: uppercase;
	font-family: "Chelsea Market", cursive;
	margin-top: 170px;
	text-align: center;
	margin-left: 30px;
}

@media (max-width: 767px) {
	.header .navbar-collapse .navbar-left {
		float: right;
		text-align: right;
	}
}

@media (max-width: 450px) {
	.header .navbar-collapse .navbar-left {
		float: left;
		text-align: left;
	}
}

.header .banner .owl-dots {
	display: flex;
	position: absolute;
	bottom: 10px;
	left: 50%;
	transform: translate(-50%, -50%);
}

@media (max-width: 767px) {
	.header .banner .owl-dots {
		bottom: -2px;
	}
}

.header .banner .owl-dots .owl-dot span {
	background: none repeat scroll 0 0 white;
	border-radius: 20px;
	display: block;
	height: 12px;
	margin: 5px 7px;
	opacity: 0.5;
	width: 12px;
}

.header .banner .owl-dots .owl-dot.active span {
	opacity: 1;
}

.header .banner .banner-content .owl-item .item h1,
.header .banner .banner-content .owl-item .item p {
	color: white;
}

@media (max-width: 767px) {
	.header .banner .banner-content .owl-item .item h1 {
		margin-top: 0;
	}
}

@media (max-width: 655px) {
	.header .banner .banner-content .owl-item .item h1 {
		font-size: 60px;
	}

	.header .banner .banner-content .owl-item .item p {
		font-size: 25px;
	}
}

@media (max-width: 450px) {
	.header .banner .banner-content .owl-item .item h1,
	.header .banner .banner-content .owl-item .item p {
		margin: 0;
	}
}

.header a.router-link-active {
	color: #f04c26 !important;
}

@media (max-width: 380px) {
	.header .banner .banner-content .owl-item .item h1 {
		font-size: 40px;
	}

	.header .banner .banner-content .owl-item .item p {
		font-size: 15px;
	}
}

.header .banner .banner-content h1 span {
	color: #f04c26;
}

.header .banner .banner-content p {
	font-size: 34px;
	font-weight: 600;
	text-transform: uppercase;
	text-align: center;
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
</style>
