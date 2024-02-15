import { FC, useContext } from 'react'
import { ErrorView } from 'errors'
import {
    Card,
    CardContent,
    LinearProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'
import { SyslogContext } from 'syslog'
import useAsync from 'hooks/use-async'
import { Severity } from 'syslog/types'

const toDateTimeString = (date: Date) =>
    `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`

const toSeverityString = (severity: Severity) => {
    switch (severity) {
        case Severity.error:
            return 'FEL'
        case Severity.warning:
            return 'VARNING'
        case Severity.info:
            return 'INFO'
        default:
            return '-'
    }
}
export const SyslogView: FC = () => {
    const { getSyslogEntries } = useContext(SyslogContext)

    const inspect = useAsync(getSyslogEntries)

    return inspect({
        pending: () => <LinearProgress />,
        resolved: (entries) => (
            <Card>
                <CardContent>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Datum</TableCell>
                                    <TableCell>Typ</TableCell>
                                    <TableCell align="right">
                                        Allvarlighet
                                    </TableCell>
                                    <TableCell>Utförare</TableCell>
                                    <TableCell>Information</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {entries.map((row, i) => (
                                    <TableRow
                                        key={i}
                                        sx={{
                                            '&:last-child td, &:last-child th':
                                                { border: 0 },
                                        }}
                                    >
                                        <TableCell
                                            component="th"
                                            scope="row"
                                            sx={{ whiteSpace: 'nowrap' }}
                                        >
                                            {toDateTimeString(new Date(row.at))}
                                        </TableCell>
                                        <TableCell>{row.type}</TableCell>
                                        <TableCell>
                                            {toSeverityString(row.severity)}
                                        </TableCell>
                                        <TableCell>{row.by}</TableCell>
                                        <TableCell>{row.message}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        ),
        rejected: (error) => <ErrorView error={error} />,
    })
}
