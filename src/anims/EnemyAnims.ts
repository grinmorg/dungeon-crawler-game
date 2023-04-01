import Phaser from "phaser";

const createSkelAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: "skel-idle",
    frames: anims.generateFrameNames("skel", {
      start: 0,
      end: 3,
      prefix: "skelet_idle_anim_f",
      suffix: ".png",
    }),
    repeat: -1, // бесконечно повторяется
    frameRate: 10, // скорость воспроизведения
  });

  anims.create({
    key: "skel-run",
    frames: anims.generateFrameNames("skel", {
      start: 0,
      end: 3,
      prefix: "skelet_run_anim_f",
      suffix: ".png",
    }),
    repeat: -1, // бесконечно повторяется
    frameRate: 10, // скорость воспроизведения
  });
};

export { createSkelAnims };
