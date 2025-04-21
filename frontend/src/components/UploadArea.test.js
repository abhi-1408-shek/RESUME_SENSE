import React from "react";
import { render, fireEvent } from "@testing-library/react";
import UploadArea from "./UploadArea";

describe("UploadArea", () => {
  it("renders drag-and-drop area and triggers onFileUpload on file select", () => {
    const onFileUpload = jest.fn();
    const { getByText, getByLabelText, container } = render(
      <UploadArea onFileUpload={onFileUpload} loading={false} />
    );
    // Simulate file input
    const input = container.querySelector('input[type="file"]');
    const file = new File(["dummy content"], "resume.pdf", { type: "application/pdf" });
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFileUpload).toHaveBeenCalledWith(file);
    // Drag and drop
    fireEvent.dragOver(container.firstChild);
    fireEvent.drop(container.firstChild, {
      dataTransfer: { files: [file] },
      preventDefault: () => {},
    });
    expect(onFileUpload).toHaveBeenCalledTimes(2);
  });
});
