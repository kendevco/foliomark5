import ts from 'typescript'
import path from 'path'
import fs from 'fs'

const formatHost: ts.FormatDiagnosticsHost = {
  getCanonicalFileName: path => path,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: () => ts.sys.newLine
}

function watchMain() {
  const configPath = ts.findConfigFile(
    /*searchPath*/ "./",
    ts.sys.fileExists,
    "tsconfig.json"
  )

  const createProgram = ts.createSemanticDiagnosticsBuilderProgram

  const host = ts.createWatchCompilerHost(
    configPath!,
    {},
    ts.sys,
    createProgram,
    reportDiagnostic,
    reportWatchStatus
  )

  ts.createWatchProgram(host)
}

function reportDiagnostic(diagnostic: ts.Diagnostic) {
  console.error(
    "Error",
    diagnostic.code,
    ":",
    ts.flattenDiagnosticMessageText(
      diagnostic.messageText,
      formatHost.getNewLine()
    )
  )
}

function reportWatchStatus(diagnostic: ts.Diagnostic) {
  console.info(ts.formatDiagnostic(diagnostic, formatHost))
}

watchMain()
