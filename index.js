// Copyright 2015, EMC, Inc.

"use strict";

var di = require('peter_test_library_not_exist'),
    _ = require('lodash'),
    core = require('on-core')(di),
    injector = new di.Injector(
        _.flatten([
            core.injectables,
            core.helper.requireGlob(__dirname + '/lib/**/*.js')
        ])
    ),
    core = injector.get('Services.Core'),
    configuration = injector.get('Services.Configuration'),
    Logger = injector.get('Logger'),
    logger = Logger.initialize('Dhcp'),
    Server = injector.get('DHCP.Proxy.Server');

core.start()
.then(function() {
    Server.create(
        configuration.get('dhcpProxyBindPort', 4011),
        {
            LegacyPort: configuration.get('dhcpProxyOutPort', 68),
            EFIPort: configuration.get('dhcpProxyEFIOutPort', 4011)
        },
        configuration.get('dhcpProxyBindAddress', '0.0.0.0')
    ).start();
})
.catch(function(e) {
    logger.critical("Error starting server", {
        error: e
    });
    process.nextTick(function() {
        process.exit(1);
    });
});
