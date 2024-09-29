fx_version 'cerulean'
game 'gta5'


ui_page "web/dist/index.html"

client_scripts {
	'build/client/client.js'
}

server_scripts {
	'build/server/server.js'
}

files {
    'web/dist/index.html',
    'web/dist/**/*',
}