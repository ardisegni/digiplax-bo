import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import UploadButton from 'vuetify-upload-button';
import Vue from 'vue';

@Component({
  components: {
    'upload-btn': UploadButton
  }
})
export default class FileUploadComponent extends Vue {
  public file: File = {} as File;

  @Prop(Number)
  public count!: number;

  @Prop(Number)
  public total!: number;

  @Prop(Boolean)
  public shown!: boolean;

  @Watch('shown')
  public onShownChanged(newVal?: boolean, oldVal?: boolean) {
    (this.$refs.uploadButton as any).clear();
  }

  public onFileUpdate(file: File): void {
    this.file = file;
  }

  public save(): void {
    this.$emit('fileUploadSaved', this.file);
  }

  public close(): void {
    this.$emit('fileUploadClosed');
  }

  public get uploadProgress(): number {
    if (this.count && this.total) {
      return (this.count / this.total) * 100;
    }
    return 0;
  }
}
