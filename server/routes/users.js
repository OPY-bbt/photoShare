const router = (ctx, next)=> {
	ctx.body = {
		msg: 'hello'
	}
	return next()
}

module.exports = router;