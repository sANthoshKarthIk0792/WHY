class HomingProjectile {
    constructor(x, y, target, gameEnv, speed = 5, turnRate = 0.08) {
        this.gameEnv = gameEnv;
        this.target = target;
        this.speed = speed;
        this.turnRate = turnRate;
        this.radius = 10;
        this.color = "red";
        this.active = true;
        
        // Set initial position explicitly
        this.position = { x: x, y: y };
        
        // Validate target has position
        if (!target || !target.position) {
            console.warn('HomingProjectile: Invalid target provided');
            this.active = false;
            return;
        }
        
        // Calculate initial velocity toward target
        const dx = target.position.x - x;
        const dy = target.position.y - y;
        const angle = Math.atan2(dy, dx);
        this.velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };
        
        console.log(`Projectile created at (${Math.round(x)}, ${Math.round(y)}) targeting ${target.spriteData?.id || 'Unknown'}`);
    }

    update() {
        if (!this.active) {
            this.markForRemoval();
            return;
        }
        
        if (!this.target || !this.target.position) {
            this.active = false;
            this.markForRemoval();
            return;
        }

        // Verify position is valid
        if (isNaN(this.position.x) || isNaN(this.position.y)) {
            console.error(`Invalid projectile position: x=${this.position.x}, y=${this.position.y}`);
            this.markForRemoval();
            return;
        }

        const dx = this.target.position.x - this.position.x;
        const dy = this.target.position.y - this.position.y;
        
        // Check if we've hit the target (collision detection)
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.radius + 20) {
            this.active = false;
            console.log('Projectile hit target!');
            this.markForRemoval();
            return;
        }

        // Homing logic
        const targetAngle = Math.atan2(dy, dx);
        const currentAngle = Math.atan2(this.velocity.y, this.velocity.x);

        let angleDiff = targetAngle - currentAngle;
        while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

        const newAngle = currentAngle + this.turnRate * angleDiff;
        this.velocity.x = Math.cos(newAngle) * this.speed;
        this.velocity.y = Math.sin(newAngle) * this.speed;

        // Update position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        // Check bounds
        if (this.gameEnv && (this.position.x < -50 || this.position.x > this.gameEnv.innerWidth + 50 ||
            this.position.y < -50 || this.position.y > this.gameEnv.innerHeight + 50)) {
            this.active = false;
            this.markForRemoval();
            return;
        }
        
        // Draw the projectile
        this.draw();
    }

    draw() {
        if (!this.active) {
            return;
        }
        
        const ctx = this.gameEnv?.ctx;
        if (!ctx) {
            return;
        }
        
        ctx.save();
        
        // Draw the projectile with a visible design
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Add a black border
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add a white center for better visibility
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius - 4, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        
        ctx.restore();
    }

    markForRemoval() {
        this.active = false;
        if (this.gameEnv && this.gameEnv.gameObjects) {
            const index = this.gameEnv.gameObjects.indexOf(this);
            if (index > -1) {
                this.gameEnv.gameObjects.splice(index, 1);
            }
        }
    }

    shouldRemove() {
        return !this.active;
    }
    
    destroy() {
        this.active = false;
    }
}

export default HomingProjectile;