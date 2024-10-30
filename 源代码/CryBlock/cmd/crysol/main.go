package main

import (
	"fmt"
	"os"

	"github.com/ethereum/go-ethereum/cmd/CryBlock/db"
	"github.com/ethereum/go-ethereum/cmd/CryBlock/replay"
	"github.com/ethereum/go-ethereum/internal/flags"
	cli "gopkg.in/urfave/cli.v1"
)

var (
	dbCommand = cli.Command{
		Name:        "db",
		Usage:       "A set of commands on substate DB",
		Description: "",
		Subcommands: []cli.Command{
			db.UpgradeCommand,
			db.CloneCommand,
			db.CompactCommand,
		},
	}
)

var (
	gitCommit = "" // Git SHA1 commit hash of the release (set via linker flags)
	gitDate   = ""

	app = flags.NewApp(gitCommit, gitDate, "CryBlock command line interface")
)

func init() {
	app.Flags = []cli.Flag{}
	app.Commands = []cli.Command{
		replay.FuzzCommand,
		replay.FuzzBatchCommand,
	}
	cli.CommandHelpTemplate = flags.OriginCommandHelpTemplate
}

func main() {
	if err := app.Run(os.Args); err != nil {
		code := 1
		fmt.Fprintln(os.Stderr, err)
		os.Exit(code)
	}
}
