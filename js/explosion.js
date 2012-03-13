var Explosion = OZ.Class().extend(HAF.AnimatedSprite);

Explosion.prototype.init = function(game, position) {
	this._game = game;
	this._size = this._game.getSize();

	var size = [128, 128];
	this._frames = 72;
	var largeSize = [size[0], size[1]*this._frames];
	var image = HAF.Sprite.get("img/explosion_128.png", largeSize, 0, true);
	
	HAF.AnimatedSprite.prototype.init.call(this, image, size, Infinity); /* remove when reached >= this._frames */
	this._sprite.position = position;
	this._animation.fps = 20;
	
	this._game.getEngine().addActor(this, Game.LAYER_FX);
	
	if (this._game.inPort(position, 100)) { Game.Audio.play("explosion"); }
}

Explosion.prototype.tick = function(dt) {
	var changed = HAF.AnimatedSprite.prototype.tick.call(this, dt);
	if (this._animation.frame >= this._frames) {
		changed = true;
		this._game.getEngine().removeActor(this, Game.LAYER_FX);
	}
	return changed;
}

Explosion.prototype.draw = function(context) {
	var offset = this._game.getOffset();
	var tmp = [0, 0];
	for (var i=0;i<2;i++) {
		tmp[i] = (this._sprite.position[i] - offset[i]).mod(this._size[i]);
	}

	context.drawImage(
		this._sprite.image, 
		0, this._animation.frame*this._sprite.size[1], this._sprite.size[0], this._sprite.size[1],
		tmp[0]-this._sprite.size[0]/2, tmp[1]-this._sprite.size[1]/2, this._sprite.size[0], this._sprite.size[1]
	);
}

Explosion.prototype.getBox = function() {
	var offset = this._game.getOffset();
	var tmp = [0, 0];
	for (var i=0;i<2;i++) {
		tmp[i] = (this._sprite.position[i] - offset[i]).mod(this._size[i]) - this._sprite.size[i]/2;
	}
	return [tmp, this._sprite.size];
}
