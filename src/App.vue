<template>
	<div id="app">
		<nav class="navbar is-light is-shadowless px-4 py-2">
			<div class="navbar-brand">
				<router-link class="navbar-item has-text-weight-semibold" to="/">Home</router-link>
			</div>
			<div class="navbar-menu is-active">
				<div class="navbar-start">
					<router-link class="navbar-item" to="/upload/so">Upload SO</router-link>
					<router-link class="navbar-item" to="/upload/iv">Upload IV</router-link>
				</div>
			</div>
		</nav>
    	<router-view />
  	</div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

* {
	box-sizing: border-box;
}

html {
	font-family: "Roboto", sans-serif;
}

body {
	margin: 0;
}
</style>