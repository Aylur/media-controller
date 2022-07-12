'use strict'

const { GObject, St, Clutter } = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension()
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const MediaPlayer = Me.imports.mediaPlayer;

const MediaController = GObject.registerClass(
class MediaController extends PanelMenu.Button {
    _init() {
        super._init(0.0, _('Media Controller'), false);

        this.label = new St.Label({
            style_class: 'mc-panel-label',
            text: 'Artist - Track',
            y_align: Clutter.ActorAlign.CENTER,
        });
        this.add_child(this.label);

        this.media = new MediaPlayer.Media();
        this.media.connect('updated', () => this.update());

        this.mainBox = new St.Bin({});
        this.menu.box.add_child(this.mainBox);
        this.menu.actor.width = Main.layoutManager.primaryMonitor.width;
        this.menu.box.x_align = Clutter.ActorAlign.CENTER;

        this.update();
    }
    update(){
        this.favPlayer = this.media.getFavPlayer();
        if(this.favPlayer){
            this.mainBox.set_child(this.favPlayer);
            this.label.text = this.favPlayer._trackArtists.join(', ') + ' - ' + this.favPlayer._trackTitle;

            this.favPlayer.connect('updated', () => this.update());
            this.show();
        }
        else{
            this.hide();
        }
    }
});

class Extension {
    constructor(uuid) {
        this._uuid = uuid;
    }
    enable() {
        this._panelButton = new MediaController();
        Main.panel.addToStatusArea(this._uuid, this._panelButton, 0, 'center');
    }
    disable() {
        this._panelButton.destroy();
        this._panelButton = null;
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}