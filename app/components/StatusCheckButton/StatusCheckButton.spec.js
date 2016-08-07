import React from "react"
import StatusCheckButton from "./StatusCheckButton";

describe("StatusCheckButton", function() {

  before(() => {
    this.load(StatusCheckButton);
  });

  it('default', () => {
    this.props({ state:'' })
  })

  it('loading', () => {
    this.props({ state:'loading' })
  })

  it('checked', () => {
    this.props({ state:'checked' })
  })

  it('error', () => {
    this.props({ state:'error' })
  })
});
