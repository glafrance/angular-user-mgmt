import { Component, Input } from "@angular/core";

@Component({
  selector: "app-page-template-one",
  templateUrl: "./page-template-one.component.html",
  styleUrls: ["./page-template-one.component.scss"]
})
export class PageTemplateOneComponent {
  @Input() title?: string;
  @Input() subTitle?: string;
}