export class ContactShadow {
    constructor($object, $scene, $renderer) {
        this.scene = $scene;
        this.renderer = $renderer;
        this.object3d = $object;

        alert('CONTACTSHADOW '+scopeAttr);

        this.isContactShadow = false;

        this.shadowGroup; 
        this.renderTarget;
        this.renderTargetBlur;
         
        this.shadowCamera;
        this.depthMaterial;
         
        this.horizontalBlurMaterial;
        this.verticalBlurMaterial;
        this.plane;
        this.blurPlane;
        this.fillPlane;
        
    }

}
export default ContactShadow;